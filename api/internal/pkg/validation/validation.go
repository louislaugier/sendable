package validation

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

func GetCurrentMonthCount(userID uuid.UUID, validationOrigin models.ValidationOrigin, validationType models.ValidationType) (*int, error) {
	rows, err := config.DB.Query(`
		SELECT COUNT(*)
		FROM public."validation"
		WHERE "user_id" = $1
		AND "origin" = $2
		AND "type" = $3
		AND EXTRACT(YEAR FROM "created_at") = EXTRACT(YEAR FROM CURRENT_DATE)
		AND EXTRACT(MONTH FROM "created_at") = EXTRACT(MONTH FROM CURRENT_DATE);
	`, userID, validationOrigin, validationType)
	if err != nil {
		return nil, err
	}

	var count *int

	for rows.Next() {
		err = rows.Scan(count)
		if err != nil {
			return nil, err
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return count, nil
}

func GetMany(userID uuid.UUID) ([]models.Validation, error) {
	rows, err := config.DB.Query(`
		SELECT "id", "user_id", "single_target_email", "upload_filename", "origin", "type", "created_at"
		FROM public."validation"
		WHERE "user_id" = $1
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var validations []models.Validation
	for rows.Next() {
		var v models.Validation
		err := rows.Scan(&v.ID, &v.UserID, &v.SingleTargetEmail, &v.UploadFilename, &v.Origin, &v.Type, &v.CreatedAt)
		if err != nil {
			return nil, err
		}
		validations = append(validations, v)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return validations, nil
}
