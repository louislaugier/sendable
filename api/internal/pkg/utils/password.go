package utils

import (
	"errors"
	"regexp"
	"strings"
)

func IsValidPassword(password string) (bool, error) {
	// Check length
	if len(password) < 8 || len(password) > 64 {
		return false, errors.New("password must be between 8-64 characters long.")
	}

	// Check complexity
	hasUppercase, _ := regexp.MatchString(`[A-Z]`, password)
	hasLowercase, _ := regexp.MatchString(`[a-z]`, password)
	hasNumber, _ := regexp.MatchString(`[0-9]`, password)
	hasSpecialChar, _ := regexp.MatchString(`[!@#$%^&*(),.?":{}|<>]`, password)

	if !hasUppercase {
		return false, errors.New("password must contain at least 1 uppercase letter (A-Z).")
	}

	if !hasLowercase {
		return false, errors.New("password must contain at least 1 lowercase letter (a-z).")
	}

	if !hasNumber {
		return false, errors.New("password must contain at least 1 numeral (0-9).")
	}

	if !hasSpecialChar {
		return false, errors.New("password must contain at least 1 special character.")
	}

	// Check for spaces
	if strings.Contains(password, " ") {
		return false, errors.New("password must not contain any spaces.")
	}

	return true, nil
}
