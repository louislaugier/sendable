package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/stripe"
	"encoding/json"
	"net/http"
)

func GenerateStripeCustomerPortalHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.CheckoutRequest{}
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
