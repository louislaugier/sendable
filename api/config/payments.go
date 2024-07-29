package config

import (
	"os"

	"github.com/stripe/stripe-go/v72"
)

var StripeSubscriptionWebhookSecret string
var StripeUnsubscriptionWebhookSecret string

func initStripeClient() {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	StripeSubscriptionWebhookSecret = os.Getenv("STRIPE_SUBSCRIPTION_WEBHOOK_SECRET")
	StripeUnsubscriptionWebhookSecret = os.Getenv("STRIPE_UNSUBSCRIPTION_WEBHOOK_SECRET")
}
