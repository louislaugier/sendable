package webhooks

import (
	"email-validator/config"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/webhook"
)

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
	subscriptionID := subscription.ID
	log.Println(customerID, subscriptionID)

	switch event.Type {
	case "customer.subscription.created":
		// TODO: insert subscription for user in DB
		// prevent more than 1 ongoing subscription at the same time
		log.Println("ok123")
	case "customer.subscription.deleted":
		log.Println("ok456")
		// TODO: update subscription for user in DB (set cancelled_at to now)
	}

	w.WriteHeader(http.StatusOK)
}
