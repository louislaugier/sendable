package models

import "errors"

var ErrNoEmailsToValidate = errors.New("no emails to validate")

var TooManyEmailsToValidate = errors.New("too emails to validate, maximum 1 million at a time")

var ErrInvalidFileExt = errors.New("invalid file format")

var ErrInvalidEmail = errors.New("invalid email address format")
