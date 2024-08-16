package models

type StripeEventType string
type StripeProductID string

const (
	StripeCustomerSubscriptionCreated StripeEventType = "customer.subscription.created"
	StripeCustomerSubscriptionDeleted StripeEventType = "customer.subscription.deleted"
)
