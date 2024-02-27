package email

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/format"
	"errors"
	"io"
	"strings"
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
		return nil, ErrNoEmailsToValidate
	}

	return nil, nil
}

// ValidateManyBulk validates emails using Reacher API with Rabbitmq
func ValidateManyBulk(emails []string) ([]models.ReacherResponse, error) {
	if len(emails) == 0 {
		return nil, ErrNoEmailsToValidate
	}

	// https://help.reacher.email/bulk-email-verification
	return nil, nil
}
