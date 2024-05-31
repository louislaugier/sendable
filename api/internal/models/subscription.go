package models

import (
	"time"

	"github.com/google/uuid"
)

type SubscriptionBillingFrequency string

const (
	MonthlyBilling SubscriptionBillingFrequency = "monthly"
	YearlyBilling  SubscriptionBillingFrequency = "yearly"
)

type SubscriptionType string

const (
	FreePlan SubscriptionType = "free"

	PremiumSubscription    SubscriptionType = "premium"
	EnterpriseSubscription SubscriptionType = "enterprise"
)

type Subscription struct {
	ID uuid.UUID `json:"id,omitempty"`

	UserID *uuid.UUID `json:"userId,omitempty"`

	BillingFrequency SubscriptionBillingFrequency `json:"billingFrequency,omitempty"`
	Type             SubscriptionType             `json:"type"`

	CreatedAt   *time.Time `json:"createdAt,omitempty"`
	CancelledAt *time.Time `json:"cancelledAt,omitempty"`
}

func EmptyFreePlan() *Subscription {
	return &Subscription{
		UserID: nil,
		Type:   FreePlan,
	}
}
