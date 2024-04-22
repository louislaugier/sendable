package models

import (
	"time"

	"github.com/google/uuid"
)

type AuthProvider string

const (
	GoogleProvider   AuthProvider = "google"
	LinkedinProvider AuthProvider = "linkedin"

	SalesforceProvider AuthProvider = "salesforce"
	ZohoProvider       AuthProvider = "zoho"
	HubspotProvider    AuthProvider = "hubspot"

	MailchimpProvider AuthProvider = "mailchimp"
)

type User struct {
	ID uuid.UUID `json:"id"`

	Email                 string `json:"email"`
	IsEmailConfirmed      bool   `json:"is_email_confirmed"`
	EmailConfirmationCode *int   `json:"-"`

	Password *string `json:"password,omitempty"`

	LastIPAddresses string `json:"-"`
	LastUserAgent   string `json:"-"`

	TwoFaPrivateKeyHash string `json:"-"`

	JWT string `json:"jwt"`

	AuthProvider *AuthProvider `json:"auth_provider,omitempty"`

	CurrentPlan *Order `json:"current_plan,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt time.Time `json:"deleted_at,omitempty"`
}

type ConfirmEmail struct {
	Email                 string `json:"email"`
	EmailConfirmationCode int    `json:"email_confirmation_code"`
}
