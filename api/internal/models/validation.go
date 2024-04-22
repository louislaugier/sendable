package models

import (
	"time"

	"github.com/google/uuid"
)

type ValidationOrigin string

const (
	AppValidation ValidationOrigin = "app"
	APIValidation ValidationOrigin = "api"
)

type ValidationType string

const (
	SingleValidation ValidationType = "single"
	BulkValidation   ValidationType = "bulk"
)

type Validation struct {
	ID uuid.UUID `json:"id"`

	UserID uuid.UUID `json:"user_id"`

	SingleTargetEmail         string `json:"single_target_email,omitempty"`
	RawBulkRequestLogFilepath string `json:"raw_bulk_request_log_filepath,omitempty"`
	UploadFilename            string `json:"upload_filename,omitempty"`

	Origin ValidationOrigin `json:"origin"`
	Type   ValidationType   `json:"type"`

	CreatedAt time.Time `json:"created_at"`
}
