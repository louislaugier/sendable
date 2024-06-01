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
	User         struct {
		ID uuid.UUID `json:"id"`

		Email                 string `json:"email"`
		IsEmailConfirmed      bool   `json:"isEmailConfirmed"`
		EmailConfirmationCode *int   `json:"-"`

		LastIPAddresses string `json:"-"`
		LastUserAgent   string `json:"-"`

		TwoFaPrivateKeyHash string `json:"-"`

		JWT string `json:"jwt"`

		AuthProvider *AuthProvider `json:"authProvider,omitempty"`

		ValidationCounts *UserValidationCounts `json:"validationCounts,omitempty"`
		CurrentPlan      *Subscription         `json:"currentPlan,omitempty"`

		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt time.Time  `json:"updatedAt"`
		DeletedAt *time.Time `json:"deletedAt,omitempty"`
	}
	ConfirmEmail struct {
		Email                 string `json:"email"`
		EmailConfirmationCode int    `json:"emailConfirmationCode"`
	}
)
