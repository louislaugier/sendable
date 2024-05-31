package subscription

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

func GetLatestActive(userID uuid.UUID) (*models.Subscription, error) {
	rows, err := config.DB.Query(`
		SELECT "billing_frequency", "type", "created_at"
		FROM public."subscription"
		WHERE "user_id" = $1 AND "cancelled_at" IS NULL
		ORDER BY "created_at" DESC LIMIT 1;
	`, userID)
	if err != nil {
		return nil, err
	}

	var subscription *models.Subscription

	for rows.Next() {
		o := models.Subscription{}

		err = rows.Scan(&o.BillingFrequency, &o.Type, &o.CreatedAt)
		if err != nil {
			return nil, err
		}

		subscription = &o
	}

	return subscription, nil
}
