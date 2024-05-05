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

type ValidationStatus string

const (
	StatusProcessing ValidationStatus = "processing"
	StatusFailed     ValidationStatus = "failed"
	StatusCompleted  ValidationStatus = "completed"
)

type Validation struct {
	ID uuid.UUID `json:"id"`

	UserID *uuid.UUID `json:"userId,omitempty"`

	GuestIP        *string `json:"-"`
	GuestUserAgent *string `json:"-"`

	SingleTargetEmail *string `json:"singleTargetEmail,omitempty"`

	UploadFilename *string    `json:"uploadFilename,omitempty"`
	ReportToken    *uuid.UUID `json:"reportToken,omitempty"`

	Origin ValidationOrigin `json:"origin"`
	Status ValidationStatus `json:"status"`

	CreatedAt time.Time `json:"createdAt"`
}
