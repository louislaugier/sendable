package models

import (
	"time"

	"github.com/google/uuid"
)

const (
	GoogleProvider   AuthProvider = "google"
	LinkedinProvider AuthProvider = "linkedin"

	SalesforceProvider AuthProvider = "salesforce"
	ZohoProvider       AuthProvider = "zoho"
	HubspotProvider    AuthProvider = "hubspot"

	MailchimpProvider AuthProvider = "mailchimp"
)

type (
	AuthProvider string

	PreAuthUser struct {
		ID           uuid.UUID `json:"id"`
		Is2FAEnabled bool      `json:"is2faEnabled"`
	}

	User struct {
		ID                    uuid.UUID `json:"id"`
		Email                 string    `json:"email"`
		IsEmailConfirmed      bool      `json:"isEmailConfirmed"`
		EmailConfirmationCode *int      `json:"-"`

		PasswordSHA256 *string `json:"passwordSha256,omitempty"`

		JWT                 string        `json:"jwt,omitempty"`
		AuthProvider        *AuthProvider `json:"authProvider,omitempty"`
		TwoFactorAuthSecret *string       `json:"-"`
		Is2FAEnabled        bool          `json:"is2faEnabled,omitempty"`

		ValidationCounts *UserValidationCounts `json:"validationCounts,omitempty"`
		CurrentPlan      *Subscription         `json:"currentPlan,omitempty"`

		LastIPAddresses string `json:"-"`
		LastUserAgent   string `json:"-"`

		CreatedAt *time.Time `json:"createdAt,omitempty"`
		UpdatedAt *time.Time `json:"updatedAt,omitempty"`
		DeletedAt *time.Time `json:"deletedAt,omitempty"`
	}
)
