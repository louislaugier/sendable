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
			(id, user_id, guest_ip, guest_user_agent, single_target_email, upload_filename, report_token, origin, status) 
		VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8, $9);
	`

	updateStatusQuery = `UPDATE public.validation SET status = $1, bulk_address_count = $2 WHERE id = $3;`
)

func InsertNew(v *models.Validation) error {
	_, err := config.DB.Exec(insertQuery, v.ID, v.UserID, v.GuestIP, v.GuestUserAgent, v.SingleTargetEmail, v.UploadFilename, v.ReportToken, v.Origin, v.Status)
	if err != nil {
		return err
	}
	return nil
}

func UpdateStatus(ID uuid.UUID, status models.ValidationStatus, bulkAddressCount *int) error {
	_, err := config.DB.Exec(updateStatusQuery, status, bulkAddressCount, ID)
	return err
}

func GetCurrentMonthCount(userID uuid.UUID, validationOrigin models.ValidationOrigin, isBulkValidation bool) (*int, error) {
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

func GetMany(userID uuid.UUID, limit, offset int) ([]models.Validation, error) {
	rows, err := config.DB.Query(`
		SELECT id, user_id, single_target_email, bulk_address_count, upload_filename, report_token, origin, status, created_at
		FROM public.validation
		WHERE user_id = $1
		LIMIT $2
		OFFSET $3;
	`, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var validations []models.Validation
	for rows.Next() {
		var v models.Validation
		err := rows.Scan(&v.ID, &v.UserID, &v.SingleTargetEmail, &v.BulkAddressCount, &v.UploadFilename, &v.ReportToken, &v.Origin, &v.Status, &v.CreatedAt)
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
