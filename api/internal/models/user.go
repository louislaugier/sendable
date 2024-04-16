package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `json:"id"`

	Email            string `json:"email"`
	IsEmailConfirmed bool   `json:"isEmailConfirmed"`

	Password string `json:"password,omitempty"`

	LastIPAddresses string
	LastUserAgent   string

	TwoFaPrivateKeyHash string

	JWT string `json:"jwt"`

	AuthProvider AuthProvider `json:"authProvider,omitempty"`
	// FacebookUserID string         `json:"facebook_user_id,omitempty"` // non empty value means fb account did not allow access to email, user should be prompted for his email until defined

	Orders []Order `json:"orders,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`
}
