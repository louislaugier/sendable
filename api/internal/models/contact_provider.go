package models

import (
	"time"

	"github.com/google/uuid"
)

const (
	// OAuth based
	SalesforceContactProvider ContactProviderType = ContactProviderType(SalesforceProvider)
	HubspotContactProvider    ContactProviderType = ContactProviderType(HubspotProvider)
	ZohoContactProvider       ContactProviderType = ContactProviderType(ZohoProvider)

	// API key based
	SendgridContactProvider ContactProviderType = "sendgrid"
	BrevoContactProvider    ContactProviderType = "brevo"
)

type (
	ContactProviderType string
	ContactProvider     struct {
		ID     uuid.UUID `json:"id"`
		UserID uuid.UUID `json:"userId"`

		Type              ContactProviderType `json:"type"`
		LatestAccessToken *string             `json:"latestAccessToken,omitempty"`
		APIKey            *string             `json:"apiKey,omitempty"`
		LatestAPIKeyChars *string             `json:"latestApiChars,omitempty"`

		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt,omitempty"`
	}
)
