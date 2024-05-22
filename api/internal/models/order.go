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
	ID uuid.UUID `json:"id,omitempty"`

	UserID *uuid.UUID `json:"userId,omitempty"`

	Duration OrderDuration `json:"duration,omitempty"`
	Type     OrderType     `json:"type"`

	CreatedAt   *time.Time `json:"createdAt,omitempty"`
	CancelledAt *time.Time `json:"cancelledAt,omitempty"`
}

func EmptyFreePlan() *Order {
	return &Order{
		UserID: nil,
		Type:   FreePlan,
	}
}
