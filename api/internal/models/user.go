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

	Email            string `json:"email"`
	IsEmailConfirmed bool   `json:"isEmailConfirmed"`

	Password *string `json:"password,omitempty"`

	LastIPAddresses string
	LastUserAgent   string

	TwoFaPrivateKeyHash string

	JWT string `json:"jwt"`

	AuthProvider *AuthProvider `json:"authProvider,omitempty"`
	// FacebookUserID string         `json:"facebook_user_id,omitempty"` // non empty value means fb account did not allow access to email, user should be prompted for his email until defined

	CurrentPlan *Order `json:"current_plan,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`
}

func (u User) IsDeleted() bool {
	return !u.DeletedAt.IsZero()
}
