package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/stripe"
)

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

	user := middleware.GetUserFromRequest(r)

	log.Println(body.PriceID, user.Email, user.StripeCustomerID)
	s, err := stripe.CreateCheckoutSession(body.PriceID, user.Email, user.StripeCustomerID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(s)
}
