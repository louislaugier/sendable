package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sendable/config"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/stripe"
	"sendable/internal/pkg/subscription"
	"sendable/internal/pkg/utils"

	"github.com/google/uuid"
)

func DowngradePlanHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.DowngradePlanHandler{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.BillingFrequency == "" {
		http.Error(w, "Missing billing_frequency in payload", http.StatusBadRequest)
		return
	}

	user := middleware.GetUserFromRequest(r)
	currentPlan := user.CurrentPlan
	if currentPlan.Type != models.EnterpriseSubscription {
		http.Error(w, "No downgrade available", http.StatusBadRequest)
		return
	}

	priceID := config.StripePremiumYearlyPriceID
	if body.BillingFrequency == models.MonthlyBilling {
		priceID = config.StripePremiumMonthlyPriceID
	}
	newStripeSubscription, err := stripe.SubscribeUser(*user.StripeCustomerID, string(priceID))
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	startingAt, err := stripe.GetSubscriptionPeriodEnd(*currentPlan.StripeSubscriptionID)
	if err != nil || startingAt == nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = subscription.InsertNew(&models.Subscription{
		ID:                   utils.NewPointer(uuid.New()),
		UserID:               utils.NewPointer(user.ID),
		BillingFrequency:     &body.BillingFrequency,
		Type:                 models.PremiumSubscription,
		StripeSubscriptionID: &newStripeSubscription.ID,
		StartingAt:           startingAt,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = stripe.CancelSubscription(*currentPlan.StripeSubscriptionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = subscription.CancelByID(*currentPlan.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
