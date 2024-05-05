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

type ValidationStatus string

const (
	StatusProcessing ValidationStatus = "processing"
	StatusFailed     ValidationStatus = "failed"
	StatusCompleted  ValidationStatus = "completed"
)

type Validation struct {
	ID uuid.UUID

	UserID         *uuid.UUID
	GuestIP        *string
	GuestUserAgent *string

	SingleTargetEmail *string
	UploadFilename    *string

	Origin ValidationOrigin
	Type   ValidationType
	Status ValidationStatus

	CreatedAt time.Time
}
