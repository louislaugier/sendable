package stripe

import (
	"time"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/sub"
)

// CancelSubscription cancels a subscription at the end of the current billing period.
func CancelSubscription(subscriptionID string) error {
	params := &stripe.SubscriptionParams{
		CancelAtPeriodEnd: stripe.Bool(true),
	}
	_, err := sub.Update(subscriptionID, params)
	return err
}

// SubscribeUser creates a new subscription for a user.
func SubscribeUser(customerID string, priceID string) (*stripe.Subscription, error) {
	params := &stripe.SubscriptionParams{
		Customer: stripe.String(customerID),
		Items: []*stripe.SubscriptionItemsParams{
			{
				Price: stripe.String(priceID),
			},
		},
	}
	return sub.New(params)
}

// Helper function to get the subscription
func GetSubscription(subscriptionID string) (*stripe.Subscription, error) {
	subscription, err := sub.Get(subscriptionID, nil)
	if err != nil {
		return nil, err
	}
	return subscription, nil
}

// Function to get the subscription period end as a time.Time pointer
func GetSubscriptionPeriodEnd(subscriptionID string) (*time.Time, error) {
	// Call the helper function to get the subscription
	subscription, err := GetSubscription(subscriptionID)
	if err != nil {
		return nil, err
	}

	// Convert the CurrentPeriodEnd (assumed to be Unix timestamp) to time.Time
	periodEnd := time.Unix(subscription.CurrentPeriodEnd, 0).UTC()

	return &periodEnd, nil
}
