package order

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

func GetLatestActive(userID uuid.UUID) (*models.Order, error) {
	rows, err := config.DB.Query(`
		SELECT "id", "user_id", "duration", "type", "created_at"
		FROM public."order"
		WHERE "user_id" = $1 AND "cancelled_at" IS NULL
		AND (
			(duration = 'monthly' AND "created_at" > current_timestamp - INTERVAL '1 month') OR
			(duration = 'yearly' AND "created_at" > current_timestamp - INTERVAL '1 year')
		)
		ORDER BY "created_at" DESC LIMIT 1;
	`, userID)
	if err != nil {
		return nil, err
	}

	var order *models.Order

	for rows.Next() {
		o := models.Order{}

		err = rows.Scan(&o.ID, &o.UserID, &o.Duration, &o.Type, &o.CreatedAt)
		if err != nil {
			return nil, err
		}

		order = &o
	}

	return order, nil
}
