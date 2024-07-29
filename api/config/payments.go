package config

import (
	"os"

	"github.com/stripe/stripe-go/v72"
)

var StripeWebhookSecret string

func initStripeClient() {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	StripeWebhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET")
}
