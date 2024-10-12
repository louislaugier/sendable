package webhooks

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"sendable/config"
	"sendable/internal/models"
	stp "sendable/internal/pkg/stripe"
	"sendable/internal/pkg/subscription"
	"sendable/internal/pkg/user"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/webhook"
)

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
	case string(models.StripePaymentIntentSucceeded):
		handleNewPayment(subscriptionID, w)
	case string(models.StripeInvoicePaymentFailed):
		handlePaymentFailure(subscriptionID, w)
	}

	w.WriteHeader(http.StatusNoContent)
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

	if planInterval == string(stripe.PlanIntervalMonth) {
		billingFrequency = models.MonthlyBilling
	} else if planInterval == string(stripe.PlanIntervalYear) {
		billingFrequency = models.YearlyBilling
	} else {
		http.Error(w, errors.New("unknown Stripe plan interval").Error(), http.StatusBadRequest)
	}

	if productID == string(config.StripePremiumProductID) {
		subscriptionType = models.PremiumSubscription
	} else if productID == string(config.StripeEnterpriseProductID) {
		subscriptionType = models.EnterpriseSubscription
	} else {
		http.Error(w, errors.New("unknown Stripe product ID").Error(), http.StatusBadRequest)
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

	previousPlan := u.CurrentPlan
	if previousPlan.Type != models.FreePlan {
		// plan upgrade (cancel old)
		err = stp.CancelSubscription(*previousPlan.StripeSubscriptionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = subscription.CancelByID(*previousPlan.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

// cancel plan (not downgrade)
func handleUnsubscription(subscriptionID string, w http.ResponseWriter) {
	err := subscription.CancelByStripeSubscriptionID(subscriptionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func handleNewPayment(subscriptionID string, w http.ResponseWriter) {
	s, err := subscription.GetByStripeSubscriptionID(subscriptionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// plan renewal
	if s != nil {
		err := subscription.InsertNewRenewal(*s.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func handlePaymentFailure(subscriptionID string, w http.ResponseWriter) {
	s, err := subscription.GetByStripeSubscriptionID(subscriptionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if s != nil {
		// failed renewal
		err = stp.CancelSubscription(subscriptionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = subscription.CancelByID(*s.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// TODO: failed payment email
	}
}
