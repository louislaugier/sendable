package models

import "errors"

var ErrNoEmailsToValidate = errors.New("no emails to validate")

var ErrTooManyEmailsToValidate = errors.New("too many emails to validate, maximum 1 million per batch")

var ErrInvalidFileExt = errors.New("invalid file format")

var ErrInvalidEmail = errors.New("invalid email address format")
