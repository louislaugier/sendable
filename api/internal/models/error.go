package models

import "errors"

var ErrNoEmailsToValidate = errors.New("no emails to validate")

var ErrInvalidFileExt = errors.New("invalid file format")

var ErrInvalidEmail = errors.New("invalid email address format")
