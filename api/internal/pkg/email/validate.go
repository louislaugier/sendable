package email

import (
	"context"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/format"
	"errors"
	"io"
	"os"
	"strconv"
	"strings"
	"sync"
)

var ErrNoEmailsToValidate = errors.New("no emails to validate")

func IsReachable(email string) bool {
	resp, err := Validate(email)
	if err != nil {
		return false
	}

	return resp.MX.AcceptsMail && resp.SMTP.IsDeliverable
}

func Validate(email string) (*models.ReacherResponse, error) {
	if format.IsEmailValid(email) {
		resp, err := postToReacher(email)
		if err != nil {
			return nil, err
		}

		return resp, nil
	}

	return nil, format.ErrInvalidEmail
}

// ValidateManyFromFile determines the file format and validates emails accordingly
func ValidateManyFromFile(reader io.Reader, extension string) ([]models.ReacherResponse, error) {
	var emails []string
	var err error

	switch strings.ToLower(extension) {
	case "csv":
		emails, err = file.GetEmailsFromCSV(reader, ',')
	case "xlsx":
		emails, err = file.GetEmailsFromXLSX(reader)
	case "xls":
		emails, err = file.GetEmailsFromXLS(reader)
	case "txt":
		emails, err = file.GetEmailsFromTXT(reader)
	default:
		return nil, format.ErrInvalidFileExt
	}

	if err != nil {
		return nil, err
	}

	resp, err := ValidateMany(emails)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

// ValidateMany validates emails using multiple goroutines.
func ValidateMany(emails []string) ([]models.ReacherResponse, error) {
	if len(emails) == 0 {
		return nil, ErrNoEmailsToValidate // Ensure that ErrNoEmailsToValidate is defined
	}

	emailChannel := make(chan string, len(emails))
	errChannel := make(chan error, 1) // Error channel with a buffer to store at least one error
	var validatedEmails []models.ReacherResponse
	var waitGroup sync.WaitGroup
	var mutex sync.Mutex

	// Default threadsCount to 10 if THREADS_COUNT is not set
	threadsCount := 10
	if tc, err := strconv.Atoi(os.Getenv("THREADS_COUNT")); err == nil {
		threadsCount = tc
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // Ensure we release resources associated with context

	for i := 0; i < threadsCount; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()
			for {
				select {
				case email, ok := <-emailChannel:
					if !ok {
						return // Channel was closed and drained
					}
					resp, err := Validate(email)
					if err != nil {
						if !errors.Is(err, format.ErrInvalidEmail) { // Ensure that format.ErrInvalidEmail is defined
							select {
							case errChannel <- err:
								cancel() // Signal all goroutines to stop by canceling the context
							default:
							}
							return
						}

						// ignore format errors: don't send request to reacher and don't include email in response
					} else {
						mutex.Lock()
						validatedEmails = append(validatedEmails, *resp)
						mutex.Unlock()
					}
				case <-ctx.Done():
					return // Context has been cancelled, stop goroutine
				}
			}
		}()
	}

	for _, email := range emails {
		email = strings.TrimSpace(email)
		if email != "" {
			select {
			case emailChannel <- email:
			case <-ctx.Done():
				break // If context is done, stop sending emails
			}
		}
	}

	close(emailChannel)
	waitGroup.Wait()

	select {
	case err := <-errChannel: // Check if an error was sent to the error channel
		return nil, err
	default:
	}

	return validatedEmails, nil
}

// ValidateManyBulk validates emails using Reacher combined with Rabbitmq
func ValidateManyBulk(emails []string) ([]models.ReacherResponse, error) {
	if len(emails) == 0 {
		return nil, ErrNoEmailsToValidate
	}

	// https://help.reacher.email/bulk-email-verification
	return nil, nil
}
