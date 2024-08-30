package models

import (
	"time"

	"github.com/google/uuid"
)

const (
	SendgridContactProvider ContactProviderType = "sendgrid"
	BrevoContactProvider    ContactProviderType = "brevo"
)

type (
	ContactProviderType string
	ContactProvider     struct {
		ID     uuid.UUID `json:"id"`
		UserID uuid.UUID `json:"userId"`

		Type                ContactProviderType `json:"type"`
		LatestContactsCount *int                `json:"latestContactsCount,omitempty"`
		APIKey              *string             `json:"apiKey,omitempty"`
		LatestAPIKeyChars   *string             `json:"latestApiKeyChars,omitempty"`

		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	}
)
