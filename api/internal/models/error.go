package models

import "errors"

var (
	ErrNoEmailsToValidate = errors.New("no emails to validate")

	ErrTooManyEmailsToValidate = errors.New("too many emails to validate, maximum 1 million per batch")

	ErrInvalidFileExt = errors.New("invalid file format")

	ErrInvalidEmail = errors.New("invalid email address format")
)
