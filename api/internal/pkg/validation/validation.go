package validation

import (
	"email-validator/config"
	"email-validator/internal/models"
	"fmt"

	"github.com/google/uuid"
)

const (
	insertQuery = `
		INSERT INTO public.validation 
			(id, user_id, guest_ip, guest_user_agent, single_target_email, upload_filename, origin, status) 
		VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8);
	`

	updateStatusQuery = `UPDATE public.validation SET status = $1 WHERE id = $2;`
)

func InsertNew(v *models.Validation) error {
	_, err := config.DB.Exec(insertQuery, v.ID, v.UserID, v.GuestIP, v.GuestUserAgent, v.SingleTargetEmail, v.UploadFilename, v.Origin, v.Status)
	if err != nil {
		return err
	}
	return nil
}

func UpdateStatus(ID uuid.UUID, status models.ValidationStatus) error {
	_, err := config.DB.Exec(updateStatusQuery, status, ID)
	return err
}

func GetCurrentMonthValidationCount(userID uuid.UUID, validationOrigin models.ValidationOrigin, isBulkValidation bool) (*int, error) {
	var (
		count int
	)

	prefix := "*"
	validationType := "NULL"
	if isBulkValidation {
		validationType = "NOT NULL"
	} else {
		prefix = "DISTINCT single_target_email"
	}

	err := config.DB.QueryRow(fmt.Sprintf(`
		SELECT COUNT(%s)
		FROM public.validation
		WHERE user_id = $1
		AND origin = $2
		AND single_target_email is %s
		AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
		AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE);
	`, prefix, validationType), userID, validationOrigin).Scan(&count)

	if err != nil {
		return nil, err
	}

	return &count, nil
}

func GetMany(userID uuid.UUID) ([]models.Validation, error) {
	rows, err := config.DB.Query(`
		SELECT id, user_id, single_target_email, upload_filename, origin, created_at
		FROM public.validation
		WHERE user_id = $1;
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var validations []models.Validation
	for rows.Next() {
		var v models.Validation
		err := rows.Scan(&v.ID, &v.UserID, &v.SingleTargetEmail, &v.UploadFilename, &v.Origin, &v.CreatedAt)
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
