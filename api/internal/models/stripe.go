package models

type StripeEventType string
type StripeProductID string

const (
	//TODO onPayment
	StripeCustomerSubscriptionCreated StripeEventType = "customer.subscription.created"
	StripeCustomerSubscriptionDeleted StripeEventType = "customer.subscription.deleted"
)
