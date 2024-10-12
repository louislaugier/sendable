package models

type StripeEventType string
type StripeProductID string
type StripePriceID string

const (
	StripePaymentIntentSucceeded      StripeEventType = "payment_intent.succeeded"
	StripeInvoicePaymentFailed        StripeEventType = "invoice.payment_failed"
	StripeCustomerSubscriptionCreated StripeEventType = "customer.subscription.created"
	StripeCustomerSubscriptionDeleted StripeEventType = "customer.subscription.deleted"
)
