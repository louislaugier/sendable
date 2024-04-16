package user

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/order"
)

func InsertNew(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec("INSERT INTO public.user (id, email, is_email_confirmed, password_sha256, last_ip_addresses, last_user_agent, auth_provider) VALUES ($1, $2, $3, $4, $5, $6, $7)", &user.ID, &user.Email, &user.IsEmailConfirmed, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	if err != nil {
		return err
	}

	return nil
}

func GetByEmailAndProvider(email string, provider models.AuthProvider) (*models.User, error) {
	query := `SELECT "id", "email", "is_email_confirmed", "last_ip_addresses", "last_user_agent", "two_fa_private_key_hash", "created_at", "updated_at" FROM public."user" WHERE "email" = $1 AND "auth_provider" = $2 AND "deleted_at" IS NULL LIMIT 1;`
	return getUserByCriteria(query, email, provider)
}

func GetByEmailAndPasswordSHA256(email, passwordSHA256 string) (*models.User, error) {
	query := `SELECT "id", "email", "is_email_confirmed", "last_ip_addresses", "last_user_agent", "two_fa_private_key_hash", "created_at", "updated_at" FROM public."user" WHERE "email" = $1 AND "password_sha256" = $2 AND "deleted_at" IS NULL LIMIT 1;`
	return getUserByCriteria(query, email, passwordSHA256)
}

func getUserByCriteria(query string, args ...interface{}) (*models.User, error) {
	rows, err := config.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var user *models.User

	for rows.Next() {
		u := models.User{}

		err = rows.Scan(&u.ID, &u.Email, &u.IsEmailConfirmed, &u.LastIPAddresses, &u.LastUserAgent, &u.TwoFaPrivateKeyHash, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}

		currentPlan, err := order.GetLatestActiveOrder(u.ID)
		if err != nil {
			return nil, err
		}
		u.CurrentPlan = currentPlan

		user = &u
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return user, nil
}
