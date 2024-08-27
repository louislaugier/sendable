package contact_provider

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

const (
	updateAPIKeyQuery = `
		UPDATE public.contact_provider SET "api_key" = $1 WHERE id = $2;
	`

	insertQuery = "INSERT INTO public.contact_provider (id, type, user_id, latest_access_token, api_key) VALUES ($1, $2, $3, $4, $5);"
)

// InsertNew inserts a new contact_provider into the database.
func InsertNew(contactProvider *models.ContactProvider) error {
	_, err := config.DB.Exec(insertQuery, &contactProvider.ID, &contactProvider.Type, &contactProvider.UserID, &contactProvider.LatestAccessToken, &contactProvider.APIKey)
	return err
}

func UpdateAPIKey(ID uuid.UUID, APIKey string) error {
	_, err := config.DB.Exec(updateAPIKeyQuery, APIKey, ID)
	return err
}
