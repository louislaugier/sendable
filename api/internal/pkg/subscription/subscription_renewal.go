package subscription

import (
	"sendable/config"

	"github.com/google/uuid"
)

const (
	insertRenewalQuery = "INSERT INTO public.subscription (subscription_id) VALUES ($1);"
)

func InsertNewRenewal(subscriptionID uuid.UUID) error {
	_, err := config.DB.Exec(insertQuery, &subscriptionID)
	return err
}
