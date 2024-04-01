package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `json:"id"`

	Email            string `json:"email,omitempty"`
	IsEmailConfirmed bool   `json:"is_email_confirmed"`

	Password string `json:"password,omitempty"`

	IPAddresses string `json:"ip_addresses,omitempty"`
	UserAgent   string `json:"user_agent,omitempty"`

	TwoFaPrivateKeyHash string `json:"twoFaPrivateKeyHash,omitempty"`

	JWT string `json:"jwt,omitempty"`

	Provider       Provider `json:"provider,omitempty"`
	FacebookUserID string   `json:"facebook_user_id,omitempty"` // non empty value means fb account did not allow access to email, user should be prompted for his email until defined

	Orders []Order `json:"orders,omitempty"`

	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	DeletedAt time.Time `json:"deleted_at,omitempty"`
}
