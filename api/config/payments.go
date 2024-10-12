package config

import (
	"os"
	"sendable/internal/models"

	"github.com/stripe/stripe-go/v72"
)

var (
	StripeWebhookSecret string

	StripePremiumProductID models.StripeProductID

	// Used to downgrade from enterprise to premium
	StripePremiumMonthlyPriceID models.StripePriceID
	StripePremiumYearlyPriceID  models.StripePriceID

	StripeEnterpriseProductID models.StripeProductID
)

func initStripeClient() {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	StripeWebhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET") // for Stripe events middleware

	StripePremiumProductID = models.StripeProductID(os.Getenv("STRIPE_PREMIUM_PRODUCT_ID"))
	StripeEnterpriseProductID = models.StripeProductID(os.Getenv("STRIPE_ENTERPRISE_PRODUCT_ID"))

	StripePremiumMonthlyPriceID = models.StripePriceID(os.Getenv("STRIPE_PREMIUM_MONTHLY_PRICE_ID"))
	StripePremiumYearlyPriceID = models.StripePriceID(os.Getenv("STRIPE_PREMIUM_YEARLY_PRICE_ID"))
}
