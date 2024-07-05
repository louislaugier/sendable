package subscription

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

const (
	getCountQuery = `
		SELECT COUNT(*)
		FROM public.subscription
		WHERE user_id = $1;
	`

	getManyQuery = `
		SELECT id, user_id, billing_frequency, type, created_at, cancelled_at
		FROM public.subscription
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2
		OFFSET $3;
	`
)

func GetMany(userID uuid.UUID, limit, offset int) ([]models.Subscription, error) {
	rows, err := config.DB.Query(getManyQuery, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []models.Subscription
	for rows.Next() {
		var s models.Subscription
		err := rows.Scan(&s.ID, &s.UserID, &s.BillingFrequency, &s.Type, &s.CreatedAt, &s.CancelledAt)
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
		SELECT "id", "billing_frequency", "type", "created_at"
		FROM public."subscription"
		WHERE "user_id" = $1 AND "cancelled_at" IS NULL
		ORDER BY "created_at" DESC LIMIT 1;
	`, userID)
	if err != nil {
		return nil, err
	}

	var subscription *models.Subscription

	for rows.Next() {
		s := models.Subscription{}

		err = rows.Scan(&s.ID, &s.BillingFrequency, &s.Type, &s.CreatedAt)
		if err != nil {
			return nil, err
		}

		subscription = &s
	}

	return subscription, nil
}
