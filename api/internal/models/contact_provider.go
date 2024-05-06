package models

import (
	"time"

	"github.com/google/uuid"
)

type ContactProviderType string

const (
	SalesforceContactProvider ContactProviderType = ContactProviderType(SalesforceProvider)
	HubspotContactProvider    ContactProviderType = ContactProviderType(HubspotProvider)
	ZohoContactProvider       ContactProviderType = ContactProviderType(ZohoProvider)
	SendgridContactProvider   ContactProviderType = "sendgrid"
	BrevoContactProvider      ContactProviderType = "brevo"
)

type ContactProvider struct {
	ID     uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"userId"`

	Type              ContactProviderType `json:"type"`
	LatestAccessToken string              `json:"latestAccessToken"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
