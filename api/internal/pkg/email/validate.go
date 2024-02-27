package email

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/format"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
)

func IsReachable(email string) bool {
	if format.IsEmailValid(email) {
		resp, err := postToReacher(email)
		if err != nil {
			return false
		}

		return resp.MX.AcceptsMail && resp.SMTP.IsDeliverable
	}
	return false
}

func Validate(email string) (*models.ReacherResponse, error) {
	if format.IsEmailValid(email) {
		resp, err := postToReacher(email)
		if err != nil {
			return nil, err
		}

		return resp, nil
	}

	return nil, format.ErrInvalid
}

// ValidateManyFromFile determines the file format and validates emails accordingly
func ValidateManyFromFile(reader io.Reader, format string) ([]models.ReacherResponse, error) {
	var emails []string
	var err error

	switch strings.ToLower(format) {
	case "csv":
		emails, err = file.GetEmailsFromCSV(reader, ',')
	case "xlsx":
		emails, err = file.GetEmailsFromXLSX(reader)
	case "xls":
		emails, err = file.GetEmailsFromXLS(reader)
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

func ValidateManyFromSliceWithBroker(emails []string) []models.ReacherResponse {
	// https://help.reacher.email/bulk-email-verification
	return nil
}

// ValidateManyFromSlice validates emails using multiple goroutines.
func ValidateManyFromSlice(emails []string) []models.ReacherResponse {
	emailChannel := make(chan string, len(emails)) // Buffer the channel to the number of emails for efficiency
	doneChannel := make(chan struct{})
	var validatedEmails []models.ReacherResponse
	var waitGroup sync.WaitGroup
	var mutex sync.Mutex // Used to protect shared slice access

	threads, err := strconv.Atoi(os.Getenv("THREADS_COUNT"))
	if err != nil {
		log.Println("Undefined env: THREADS_COUNT")
		panic(err)
	}
	// Start worker goroutines
	for i := 0; i < threads; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()
			for email := range emailChannel {
				if resp, err := Validate(email); err == nil {
					mutex.Lock() // Protect access to the validatedEmails slice
					validatedEmails = append(validatedEmails, *resp)
					mutex.Unlock()
				}
			}
		}()
	}

	// Send emails to workers
	for _, email := range emails {
		email = strings.TrimSpace(email)
		if email != "" {
			emailChannel <- email
		}
	}

	close(emailChannel) // Close the channel to signal the end of data
	waitGroup.Wait()    // Wait for all goroutines to finish
	close(doneChannel)  // Signal that processing is done

	return validatedEmails
}
