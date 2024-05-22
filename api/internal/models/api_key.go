package models

import (
	"time"

	"github.com/google/uuid"
)

type APIKey struct {
	ID uuid.UUID `json:"id,omitempty"`

	LastChars string `json:"lastChars"`

	Label string `json:"label"`

	UserID uuid.UUID `json:"userId,omitempty"`

	CreatedAt time.Time  `json:"createdAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}
