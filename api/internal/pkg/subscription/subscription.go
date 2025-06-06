package subscription

import (
	"sendable/config"
	"sendable/internal/models"

	"github.com/google/uuid"
)

const (
	insertQuery = "INSERT INTO public.subscription (id, user_id, billing_frequency, type, stripe_subscription_id, starting_after) VALUES ($1, $2, $3, $4, $5, $6);"

	getCountQuery = `
		SELECT COUNT(*)
		FROM public.subscription
		WHERE user_id = $1;
	`

	getLatestActiveQuery = `
		SELECT s."id", s."billing_frequency", s."type", s."created_at", s."cancelled_at", s."starting_after", s."stripe_subscription_id", sr."renewed_at"
		FROM public."subscription" s
		LEFT JOIN public."subscription_renewal" sr ON s."id" = sr."subscription_id"
		WHERE s."user_id" = $1
		AND (s."cancelled_at" IS NULL OR s."cancelled_at" > NOW())
		AND (
			(s."starting_after" IS NOT NULL AND s."starting_after" + 
			CASE s."billing_frequency"
			WHEN 'monthly' THEN INTERVAL '1 month'
			WHEN 'yearly' THEN INTERVAL '1 year'
			END > NOW())
			OR (s."starting_after" IS NULL AND s."created_at" + 
			CASE s."billing_frequency"
			WHEN 'monthly' THEN INTERVAL '1 month'
			WHEN 'yearly' THEN INTERVAL '1 year'
			END > NOW())
		)
		ORDER BY 
		COALESCE(sr."renewed_at", s."created_at") DESC
		LIMIT 1;
	`

	// Error getting user's upcoming plan: pq: missing FROM-clause entry for table "sr"
	getUpcomingQuery = `
		SELECT s."id", s."billing_frequency", s."type", s."created_at", s."cancelled_at", s."starting_after", s."stripe_subscription_id"
		FROM public."subscription" s
		WHERE s."user_id" = $1
		AND s."starting_after" > NOW()
		AND s."cancelled_at" IS NULL
		ORDER BY s."created_at" DESC
		LIMIT 1;
	`

	getManyQuery = `
		SELECT s.id, s.user_id, s.billing_frequency, s.type, s.stripe_subscription_id, s.created_at, s.cancelled_at, sr.renewed_at
		FROM public.subscription s
		LEFT JOIN (
			SELECT subscription_id, MAX(renewed_at) AS renewed_at
			FROM public.subscription_renewal
			GROUP BY subscription_id
		) sr ON s.id = sr.subscription_id
		WHERE s.user_id = $1
		ORDER BY s.created_at DESC
		LIMIT $2
		OFFSET $3;
	`

	getByStripeSusbcriptionIDQuery = `
		SELECT id, user_id, billing_frequency, type, stripe_subscription_id, created_at, cancelled_at, starting_after
		FROM public.subscription
		WHERE stripe_subscription_id = $1
		LIMIT 1;
	`

	cancelByIDQuery = `
		UPDATE public.subscription SET "cancelled_at" = now() WHERE id = $1;
	`
	cancelByStripeSubscriptionIDQuery = `
		UPDATE public.subscription SET "cancelled_at" = now() WHERE stripe_subscription_id = $1;
	`
)

func InsertNew(subscription *models.Subscription) error {
	_, err := config.DB.Exec(insertQuery, &subscription.ID, &subscription.UserID, &subscription.BillingFrequency, &subscription.Type, &subscription.StripeSubscriptionID, &subscription.StartingAt)
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

		err := rows.Scan(&s.ID, &s.UserID, &s.BillingFrequency, &s.Type, &s.StripeSubscriptionID, &s.CreatedAt, &s.CancelledAt, &s.LatestRenewedAt)
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
	rows, err := config.DB.Query(getLatestActiveQuery, userID)
	if err != nil {
		return nil, err
	}

	var subscription *models.Subscription

	for rows.Next() {
		s := models.Subscription{}

		err = rows.Scan(&s.ID, &s.BillingFrequency, &s.Type, &s.CreatedAt, &s.CancelledAt, &s.StartingAt, &s.StripeSubscriptionID, &s.LatestRenewedAt)
		if err != nil {
			return nil, err
		}

		subscription = &s
	}

	return subscription, nil
}

func GetUpcoming(userID uuid.UUID) (*models.Subscription, error) {
	rows, err := config.DB.Query(getUpcomingQuery, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscription *models.Subscription
	for rows.Next() {
		s := models.Subscription{}
		err := rows.Scan(
			&s.ID,
			&s.BillingFrequency,
			&s.Type,
			&s.CreatedAt,
			&s.CancelledAt,
			&s.StartingAt,
			&s.StripeSubscriptionID,
		)
		if err != nil {
			return nil, err
		}
		subscription = &s
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return subscription, nil
}

func CancelByID(ID uuid.UUID) error {
	_, err := config.DB.Exec(cancelByIDQuery, ID)
	return err
}

func CancelByStripeSubscriptionID(stripeSubscriptionID string) error {
	_, err := config.DB.Exec(cancelByStripeSubscriptionIDQuery, stripeSubscriptionID)
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
