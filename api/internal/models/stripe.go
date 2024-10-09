package models

type StripeEventType string
type StripeProductID string

const (
	StripeCustomerSubscriptionCreated StripeEventType = "customer.subscription.created"
	StripeCustomerSubscriptionUpdated StripeEventType = "customer.subscription.updated"
	StripeCustomerSubscriptionDeleted StripeEventType = "customer.subscription.deleted"
)
