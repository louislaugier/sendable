package webhooks

import (
	"email-validator/config"
	"io"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v72/webhook"
)

// TODO: prevent 2 or more ongoing subscriptions at the same time except if (in that case cancel current one):
// - latest valid ongoing subscription is user's only subscription and is less than 7 days old (ongoing trial)
// - latest valid ongoing subscription = premium and NEW incoming subscription = enterprise

// This webhook is triggered when a payment is succesfully received for a subscription plan
func SubscribeToPlanHandler(w http.ResponseWriter, r *http.Request) {
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

	event, err := webhook.ConstructEvent(payload, r.Header.Get("Stripe-Signature"), config.StripeSubscriptionWebhookSecret)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	switch event.Type {
	case "checkout.session.completed":
		// Insert subscription for user in DB
		log.Println("ok123")
	}

	w.WriteHeader(http.StatusOK)
}
