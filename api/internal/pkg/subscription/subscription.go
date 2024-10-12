package subscription

import (
	"sendable/config"
	"sendable/internal/models"

	"github.com/google/uuid"
)

const (
	insertQuery = "INSERT INTO public.subscription (id, user_id, billing_frequency, type, stripe_subscription_id) VALUES ($1, $2, $3, $4, $5);"

	getCountQuery = `
		SELECT COUNT(*)
		FROM public.subscription
		WHERE user_id = $1;
	`

	getManyQuery = `
		SELECT id, user_id, billing_frequency, type, stripe_subscription_id, created_at, cancelled_at
		FROM public.subscription
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2
		OFFSET $3;
	`

	getByStripeSusbcriptionIDQuery = `
		SELECT id, user_id, billing_frequency, type, stripe_subscription_id, created_at, cancelled_at, starting_at
		FROM public.subscription
		WHERE stripe_subscription_id = $1
		LIMIT 1;
	`

	cancelByIDQuery = `
		UPDATE public.subscription SET "cancelled_at" = now() WHERE id = $1;
	`
	CancelByStripeSubscriptionIDQuery = `
		UPDATE public.subscription SET "cancelled_at" = now() WHERE stripe_subscription_id = $1;
	`
)

func InsertNew(subscription *models.Subscription) error {
	_, err := config.DB.Exec(insertQuery, &subscription.ID, &subscription.UserID, &subscription.BillingFrequency, &subscription.Type, &subscription.StripeSubscriptionID)
	return err
}

func GetMany(userID uuid.UUID, limit, offset int) ([]models.Subscription, error) {
	rows, err := config.DB.Query(getManyQuery, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []models.Subscription
	for rows.Next() {
		var s models.Subscription
		err := rows.Scan(&s.ID, &s.UserID, &s.BillingFrequency, &s.Type, &s.StripeSubscriptionID, &s.CreatedAt, &s.CancelledAt)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return subscriptions, nil
}

func GetCount(userID uuid.UUID) (*int, error) {
	rows, err := config.DB.Query(getCountQuery, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var count int
	for rows.Next() {
		err := rows.Scan(&count)
		if err != nil {
			return nil, err
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &count, nil
}

func GetLatestActive(userID uuid.UUID) (*models.Subscription, error) {
	rows, err := config.DB.Query(`
		SELECT "id", "billing_frequency", "type", "created_at", "stripe_subscription_id"
		FROM public."subscription"
		WHERE "user_id" = $1
		  AND ("cancelled_at" IS NULL OR "cancelled_at" > NOW())
		  AND ("start" IS NULL OR "start" < NOW())
		ORDER BY 
		  CASE WHEN "start" IS NOT NULL THEN "start" END ASC,
		  "created_at" DESC
		LIMIT 1;
	`, userID)
	if err != nil {
		return nil, err
	}

	var subscription *models.Subscription

	for rows.Next() {
		s := models.Subscription{}

		err = rows.Scan(&s.ID, &s.BillingFrequency, &s.Type, &s.CreatedAt, &s.StripeSubscriptionID)
		if err != nil {
			return nil, err
		}

		subscription = &s
	}

	return subscription, nil
}

func CancelByID(ID uuid.UUID) error {
	_, err := config.DB.Exec(cancelByIDQuery, ID)
	return err
}

func CancelByStripeSubscriptionID(stripeSubscriptionID string) error {
	_, err := config.DB.Exec(CancelByStripeSubscriptionIDQuery, stripeSubscriptionID)
	return err
}

func GetByStripeSubscriptionID(subscriptionID string) (*models.Subscription, error) {
	rows, err := config.DB.Query(getByStripeSusbcriptionIDQuery, subscriptionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscription *models.Subscription
	for rows.Next() {
		err := rows.Scan(&subscription.ID, &subscription.UserID, &subscription.BillingFrequency, &subscription.Type, &subscription.StripeSubscriptionID, &subscription.CreatedAt, &subscription.CancelledAt, &subscription.StartingAt)
		if err != nil {
			return nil, err
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return subscription, nil
}
