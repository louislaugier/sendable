package webhooks

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/webhook"
)

// This webhook is triggered when a user cancels his subscription plan
func UnsubscribeFromPlanHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	const MaxBodyBytes = int64(65536)
	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
	payload, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Request body too large", http.StatusRequestEntityTooLarge)
		return
	}

	event := stripe.Event{}

	event, err = webhook.ConstructEvent(payload, r.Header.Get("Stripe-Signature"), "your-webhook-secret")
	if err != nil {
		log.Printf("Error verifying webhook signature: %v", err)
		http.Error(w, "Invalid signature", http.StatusBadRequest)
		return
	}

	switch event.Type {
	case "customer.subscription.deleted":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			log.Printf("Error parsing webhook JSON: %v", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		// TODO: set subscription as cancelled in DB
	default:
		log.Printf("Unhandled event type: %s", event.Type)
	}

	w.WriteHeader(http.StatusOK)

	w.WriteHeader(http.StatusOK)
}
