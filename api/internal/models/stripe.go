package models

type StripeEventType string
type StripeProductID string
type StripePriceID string

const (
	StripePaymentIntentSucceeded      StripeEventType = "payment_intent.succeeded"
	StripeCustomerSubscriptionCreated StripeEventType = "customer.subscription.created"
	StripeCustomerSubscriptionDeleted StripeEventType = "customer.subscription.deleted"
)
