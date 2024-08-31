package validation

import (
	"email-validator/config"
	"email-validator/internal/models"

	"github.com/google/uuid"
)

const (
	insertQuery = `
		INSERT INTO public.validation 
			(id, user_id, guest_ip, guest_user_agent, single_target_email, single_target_reachability, upload_filename, report_token, origin, status, provider_source) 
		VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
	`

	getCountQuery = `
		SELECT COUNT(*)
		FROM public.validation
		WHERE user_id = $1;
	`

	getManyQuery = `
		SELECT id, user_id, single_target_email, single_target_reachability, bulk_address_count, upload_filename, report_token, provider_source, origin, status, created_at
		FROM public.validation
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2
		OFFSET $3;
	`

	getCurrentMonthCountsQuery = `
		SELECT 
			SUM(CASE WHEN origin = 'app' THEN COALESCE(bulk_address_count, 1) ELSE 0 END) AS "appValidationsCount",
			SUM(CASE WHEN origin = 'api' THEN COALESCE(bulk_address_count, 1) ELSE 0 END) AS "apiValidationsCount"
		FROM 
			public."validation"
		WHERE 
			user_id = $1;
	`

	updateStatusQuery = `UPDATE public.validation SET status = $1, bulk_address_count = $2 WHERE id = $3;`
)

func InsertNew(v *models.Validation) error {
	_, err := config.DB.Exec(insertQuery, v.ID, v.UserID, v.GuestIP, v.GuestUserAgent, v.SingleTargetEmail, v.SingleTargetReachability, v.UploadFilename, v.ReportToken, v.Origin, v.Status, v.ProviderSource)
	if err != nil {
		return err
	}
	return nil
}

func UpdateStatus(ID uuid.UUID, status models.ValidationStatus, bulkAddressCount *int) error {
	_, err := config.DB.Exec(updateStatusQuery, status, bulkAddressCount, ID)
	return err
}

func GetCurrentMonthLimitCounts(userID uuid.UUID) (*models.UserValidationCounts, error) {
	counts := &models.UserValidationCounts{}

	var (
		appValidationsCount,
		APIValidationsCount *int
	)

	err := config.DB.QueryRow(getCurrentMonthCountsQuery, userID).Scan(&appValidationsCount, &APIValidationsCount)
	if err != nil {
		return nil, err
	}

	if appValidationsCount != nil {
		counts.AppValidationsCount = *appValidationsCount
	}
	if APIValidationsCount != nil {
		counts.APIValidationsCount = *APIValidationsCount
	}

	return counts, nil
}

func GetMany(userID uuid.UUID, limit, offset int) ([]models.Validation, error) {
	rows, err := config.DB.Query(getManyQuery, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var validations []models.Validation
	for rows.Next() {
		var v models.Validation
		err := rows.Scan(&v.ID, &v.UserID, &v.SingleTargetEmail, &v.SingleTargetReachability, &v.BulkAddressCount, &v.UploadFilename, &v.ReportToken, &v.ProviderSource, &v.Origin, &v.Status, &v.CreatedAt)
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
