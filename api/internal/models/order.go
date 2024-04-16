package models

import (
	"time"

	"github.com/google/uuid"
)

type OrderDuration string

const (
	MonthlyOrder OrderDuration = "monthly"
	YearlyOrder  OrderDuration = "yearly"
)

type OrderType string

const (
	FreePlan OrderType = "free"

	PremiumOrder    OrderType = "premium"
	EnterpriseOrder OrderType = "enterprise"
)

type Order struct {
	ID int `json:"id,omitempty"`

	UserID uuid.UUID `json:"user_id"`

	Duration OrderDuration `json:"duration,omitempty"`
	Type     OrderType     `json:"type"`

	CreatedAt   time.Time `json:"created_at,omitempty"`
	CancelledAt time.Time `json:"cancelled_at,omitempty"`
}
