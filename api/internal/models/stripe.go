package models

type StripeEventType string
type StripeProductID string

const (
	StripePremiumProductID    StripeProductID = "prod_QYmH8rsnjiVeJW"
	StripeEnterpriseProductID StripeProductID = "prod_QYmSwH3N6nSDcs"

	StripeCustomerSubscriptionCreated StripeEventType = "customer.subscription.created"
	StripeCustomerSubscriptionDeleted StripeEventType = "customer.subscription.deleted"
)
