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

		Type            ContactProviderType `json:"type"`
		APIKey          *string             `json:"apiKey,omitempty"`
		LastAPIKeyChars *string             `json:"lastApiKeyChars,omitempty"`

		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	}
)
