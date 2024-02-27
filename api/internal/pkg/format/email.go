package format

import (
	"errors"
	"net/mail"
	"regexp"
	"strings"
	"unicode"
)

var ErrInvalidEmail = errors.New("invalid email address format")

func IsEmailValid(email string) bool {
	_, err := mail.ParseAddress(email)

	return err != nil && isEmailValidRegex(email) && hasMoreLettersThanNumbersInUsername(email)
}

func FilterInvalidEmails(emails []string) []string {
	newEmails := []string{}

	for _, email := range emails {
		if IsEmailValid(email) {
			newEmails = append(newEmails, email)
		}
	}

	return newEmails
}

// dodge trap emails
func hasMoreLettersThanNumbersInUsername(email string) bool {
	username := strings.Split(email, "@")[0]
	numLetters := 0
	numNumbers := 0
	for _, char := range username {
		if unicode.IsLetter(char) {
			numLetters++
		} else if unicode.IsNumber(char) {
			numNumbers++
		}
	}

	return numNumbers <= numLetters
}

// isEmailValidRegex checks if the string is an email address using a regular expression.
func isEmailValidRegex(email string) bool {
	// This is a very simple regex for email and is not fully RFC-compliant.
	// For a production application, consider a more thorough validation method.
	regexPattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	emailRegex := regexp.MustCompile(regexPattern)
	return emailRegex.MatchString(email)
}
