package api_key

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

const (
	getCountQuery = `
		SELECT COUNT(*)
		FROM public.api_key
		WHERE user_id = $1;
	`

	insertQuery = "INSERT INTO public.api_key (id, key_sha256, label, last_chars, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6);"

	getManyQuery = `
		SELECT id, label, last_chars, created_at
		FROM public.api_key
		WHERE user_id = $1
		AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2
		OFFSET $3;
	`

	deleteQuery = `
		DELETE FROM public.api_key
		WHERE user_id = $1
		AND id = $2;
	`
)

// InsertNew inserts a new API key into the database.
func InsertNew(a *models.APIKey, encryptedKey *string) error {
	_, err := config.DB.Exec(insertQuery, &a.ID, encryptedKey, &a.Label, &a.LastChars, &a.UserID, &a.CreatedAt)
	return err
}

func GetMany(userID uuid.UUID, limit, offset int) ([]models.APIKey, error) {
	rows, err := config.DB.Query(getManyQuery, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var APIKeys []models.APIKey
	for rows.Next() {
		var a models.APIKey
		err := rows.Scan(&a.ID, &a.Label, &a.LastChars, &a.CreatedAt)
		if err != nil {
			return nil, err
		}
		APIKeys = append(APIKeys, a)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return APIKeys, nil
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

func Delete(userID uuid.UUID, APIKeyID uuid.UUID) error {
	_, err := config.DB.Exec(deleteQuery, userID, APIKeyID)
	return err
}
