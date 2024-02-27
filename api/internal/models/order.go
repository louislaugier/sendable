package models

import (
	"time"

	"github.com/google/uuid"
)

type OrderDuration string

const (
	MonthlyOrder  OrderDuration = "monthly"
	YearlyOrder   OrderDuration = "yearly"
	LifetimeOrder OrderDuration = "lifetime"
)

type Order struct {
	ID int `json:"id"`

	UserID uuid.UUID `json:"user_id"`

	Duration OrderDuration `json:"duration"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
