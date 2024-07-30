package stripe

import (
	"github.com/stripe/stripe-go/v72/sub"
)

func CancelSubscription(subscriptionID string) error {
	_, err := sub.Cancel(subscriptionID, nil)
	return err
}
