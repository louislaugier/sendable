package stripe

import (
	"time"

	"github.com/stripe/stripe-go/v72/sub"
)

func CancelSubscription(subscriptionID string, cancelledAt *time.Time) error {
	_, err := sub.Cancel(subscriptionID, nil)
	return err
}
