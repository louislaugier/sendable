package stripe

import (
	"email-validator/config"
	"fmt"

	"github.com/stripe/stripe-go/v72"
	bs "github.com/stripe/stripe-go/v72/billingportal/session"
	cs "github.com/stripe/stripe-go/v72/checkout/session"
)

func CreateCheckoutSession(priceID string) (*stripe.CheckoutSession, error) {
	s, err := cs.New(&stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL: stripe.String(fmt.Sprintf("%s/pricing?subscription=success", config.FrontendURL)),
		CancelURL:  stripe.String(fmt.Sprintf("%s/pricing?subscription=cancel", config.FrontendURL)),
	})

	if err != nil {
		return nil, err
	}

	return s, nil
}

func CreateCustomerPortalSession(customerID string) (*stripe.BillingPortalSession, error) {
	s, err := bs.New(&stripe.BillingPortalSessionParams{
		Customer:  stripe.String(customerID),
		ReturnURL: stripe.String(config.FrontendURL),
	})

	if err != nil {
		return nil, err

	}

	return s, nil
}
