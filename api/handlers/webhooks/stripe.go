package webhooks

import (
	"email-validator/config"
	"email-validator/internal/models"
	stp "email-validator/internal/pkg/stripe"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/webhook"
)

// TODO: clean logs

// This webhook is triggered when a payment is succesfully received for a subscription plan
func StripeWebhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, int64(65536))

	payload, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusServiceUnavailable)
		return
	}

	event, err := webhook.ConstructEvent(payload, r.Header.Get("Stripe-Signature"), config.StripeWebhookSecret)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var subscription stripe.Subscription
	if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	customerID := subscription.Customer.ID
	customerEmail := subscription.Customer.Email

	subscriptionID := subscription.ID

	switch event.Type {
	case "customer.subscription.created":
		handleNewSubscription(customerID, customerEmail, w)
	case "customer.subscription.deleted":
		handleUnsubscription(subscriptionID, w)
	}

	w.WriteHeader(http.StatusOK)
}

func handleNewSubscription(customerID, customerEmail string, w http.ResponseWriter) {
	log.Println("ok123")
	var (
		u   *models.User
		err error
	)

	u, err = user.GetByStripeCustomerID(customerID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else if u == nil {
		u, err = user.GetByEmail(customerEmail)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else if u == nil {
			http.Error(w, fmt.Sprintf("user not found with customer email %s", customerEmail), http.StatusNotFound)
			return
		}

		err = user.SetStripeCustomerID(u.ID, customerID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if u.CurrentPlan.Type != models.FreePlan {
		// TODO: cancel current subscription for user in DB (set cancelled_at to now where id = u.CurrentPlan.ID)

		err = stp.CancelSubscription(u.CurrentPlan.StripeSubscriptionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// TODO: insert subscription
}

func handleUnsubscription(subscriptionID string, w http.ResponseWriter) {
	log.Println("ok456")
	// TODO: cancel subscription for user in DB where stripe_subscription_id = subscriptionID
}
