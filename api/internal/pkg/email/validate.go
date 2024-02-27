package email

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"fmt"
	"io"
	"log"
	"strings"
	"sync"
)

func IsValid(email string) bool {
	if hasMoreLettersThanNumbersInUsername(email) {
		resp, err := postToReacher(email)
		if err != nil {
			return false
		}

		mx, ok := resp["mx"]
		if ok {
			_, ok = mx.(map[string]interface{})["accepts_mail"]
			if ok {
				isReachable, ok := resp["is_reachable"]

				// return ok && isReachable == "safe"
				return ok && (isReachable == "safe" || isReachable == "risky")
			}
		}

	}
	return false
}

// ValidateManyFromFile determines the file format and validates emails accordingly
func ValidateManyFromFile(reader io.Reader, format string) ([]string, error) {
	var emails []string
	var err error

	switch strings.ToLower(format) {
	case "csv":
		emails, err = file.GetEmailsFromCSV(reader, ',')
	case "xlsx":
		emails, err = file.GetEmailsFromXLSX(reader)
	case "txt":
		emails, err = file.GetEmailsFromTXT(reader)
	default:
		return nil, fmt.Errorf("unsupported file format: %s", format)
	}

	if err != nil {
		return nil, err
	}

	return ValidateManyFromSlice(emails), nil
}

// ValidateManyFromSlice takes a slice of strings and validates emails using 128 goroutines.
func ValidateManyFromSlice(emails []string) []string {
	emailChannel := make(chan models.EmailWithLine, len(emails)) // Buffer the channel to the number of emails for efficiency
	doneChannel := make(chan struct{})
	var validEmails []string
	var waitGroup sync.WaitGroup
	var mutex sync.Mutex // Used to protect shared slice access

	// Start worker goroutines
	for i := 0; i < 128; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()
			for emailWithLine := range emailChannel {
				if IsValid(emailWithLine.Email) {
					mutex.Lock() // Protect access to the validEmails slice
					validEmails = append(validEmails, emailWithLine.Email)
					mutex.Unlock()
				} else {
					log.Printf("Invalid email: %s.\n", emailWithLine.Email)
				}
			}
		}()
	}

	// Send emails to workers
	for lineNumber, emailStr := range emails {
		emailStr = strings.TrimSpace(emailStr)
		if emailStr != "" {
			emailChannel <- models.EmailWithLine{Email: emailStr, LineNumber: lineNumber}
		}
	}

	close(emailChannel) // Close the channel to signal the end of data
	waitGroup.Wait()    // Wait for all goroutines to finish
	close(doneChannel)  // Signal that processing is done

	file.SaveStringsToNewCSV(validEmails, ".")

	return validEmails
}
