package webhooks

import (
	"email-validator/config"
	"email-validator/internal/models"
	stp "email-validator/internal/pkg/stripe"
	"email-validator/internal/pkg/subscription"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/webhook"
)

// TODO: test locally with CLI (cf .env duplicated STRIPE_WEBHOOK_SECRET)
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

	productID := subscription.Items.Data[0].Plan.Product.ID
	planInterval := subscription.Items.Data[0].Plan.Interval

	switch event.Type {
	case string(models.StripeCustomerSubscriptionCreated):
		handleNewSubscription(customerID, customerEmail, subscriptionID, productID, string(planInterval), w)
	case string(models.StripeCustomerSubscriptionDeleted):
		handleUnsubscription(subscriptionID, w)
	}

	w.WriteHeader(http.StatusOK)
}

func handleNewSubscription(customerID, customerEmail, subscriptionID, productID, planInterval string, w http.ResponseWriter) {
	var (
		u   *models.User
		err error

		billingFrequency models.SubscriptionBillingFrequency
		subscriptionType models.SubscriptionType
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
		err = subscription.CancelByID(*u.CurrentPlan.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = stp.CancelSubscription(*u.CurrentPlan.StripeSubscriptionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if planInterval == string(stripe.PlanIntervalMonth) {
		billingFrequency = models.MonthlyBilling
	} else if planInterval == string(stripe.PlanIntervalYear) {
		billingFrequency = models.YearlyBilling
	}

	if productID == string(models.StripePremiumProductID) {
		subscriptionType = models.PremiumSubscription
	} else if productID == string(models.StripeEnterpriseProductID) {
		subscriptionType = models.EnterpriseSubscription
	}

	ID, userID := uuid.New(), u.ID
	err = subscription.InsertNew(&models.Subscription{
		ID:                   &ID,
		UserID:               &userID,
		BillingFrequency:     &billingFrequency,
		Type:                 subscriptionType,
		StripeSubscriptionID: &subscriptionID,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func handleUnsubscription(subscriptionID string, w http.ResponseWriter) {
	err := subscription.CancelByStripeSubscriptionID(subscriptionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
