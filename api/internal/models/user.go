package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID uuid.UUID `json:"uuid.UUID"`

	Email    string `json:"email"`
	Password string `json:"password,omitempty"`

	IP string `json:"IP,omitempty"`

	TwoFaPrivateKeyHash string `json:"twoFaPrivateKeyHash,omitempty"`

	Orders []*Order `json:"orders,omitempty"`

	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	DeletedAt time.Time `json:"deleted_at,omitempty"`
}
