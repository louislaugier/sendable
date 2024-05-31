package models

import (
	"time"

	"github.com/google/uuid"
)

type (
	ValidationOrigin string

	ValidationStatus string

	Validation struct {
		ID     uuid.UUID  `json:"id"`
		UserID *uuid.UUID `json:"userId,omitempty"`

		// Single validation fields
		GuestIP                  *string       `json:"-"`
		GuestUserAgent           *string       `json:"-"`
		SingleTargetEmail        *string       `json:"singleTargetEmail,omitempty"`
		SingleTargetReachability *Reachability `json:"singleTargetReachability,omitempty"`

		// Bulk validation fields
		UploadFilename   *string              `json:"uploadFilename,omitempty"`
		BulkAddressCount *int                 `json:"bulkAddressCount,omitempty"`
		ReportToken      *uuid.UUID           `json:"reportToken,omitempty"`
		ProviderSource   *ContactProviderType `json:"providerSource,omitempty"`

		Origin    ValidationOrigin `json:"origin"`
		Status    ValidationStatus `json:"status"`
		CreatedAt time.Time        `json:"createdAt"`
	}
)

const (
	AppValidation ValidationOrigin = "app"
	APIValidation ValidationOrigin = "api"

	StatusProcessing ValidationStatus = "processing"
	StatusFailed     ValidationStatus = "failed"
	StatusCompleted  ValidationStatus = "completed"
)
