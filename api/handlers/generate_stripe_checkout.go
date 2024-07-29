package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/stripe"
	"encoding/json"
	"net/http"
)

// TODO: prevent 2 or more ongoing subscriptions at the same time except if (in that case cancel current one):
// - latest valid ongoing subscription is user's only subscription and is less than 7 days old (ongoing trial)
// - latest valid ongoing subscription = premium and NEW incoming subscription = enterprise
func GenerateStripeCheckoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.GenerateStripeCheckoutRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	s, err := stripe.CreateCheckoutSession(body.PriceID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(s)
}
