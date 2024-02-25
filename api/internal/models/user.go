package models

import (
	"time"

	"github.com/google/uuid"
)

type Provider string

const (
	GoogleProvider     Provider = "google"
	FacebookProvider   Provider = "facebook"
	AppleProvider      Provider = "apple"
	SalesforceProvider Provider = "salesforce"
	ZohoProvider       Provider = "zoho"
	HubspotProvider    Provider = "hubspot"
)

type User struct {
	ID uuid.UUID `json:"uuid.UUID"`

	Email    string `json:"email"`
	Password string `json:"password,omitempty"`

	IP string `json:"IP,omitempty"`

	TwoFaPrivateKeyHash string `json:"twoFaPrivateKeyHash,omitempty"`

	JWT string `json:"jwt,omitempty"`

	Provider Provider `json:"provider,omitempty"`

	Orders []*Order `json:"orders,omitempty"`

	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	DeletedAt time.Time `json:"deleted_at,omitempty"`
}
