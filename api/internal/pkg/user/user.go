package user

import (
	"email-validator/config"
	"email-validator/internal/models"
	"errors"
	"fmt"
)

func GetByEmailAndProvider(email string, provider models.AuthProvider) (*models.User, error) {
	rows, err := config.DB.Query(fmt.Sprintf(`SELECT "id", "email", "is_email_confirmed", "last_ip_addresses", "last_user_agent", "two_fa_private_key_hash", "auth_provider", "created_at", "updated_at", "deleted_at" FROM public."user" WHERE "email" = '%s' AND "auth_provider" = '%s' LIMIT 1;`, email, provider))

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var user *models.User

	for rows.Next() {
		u := models.User{}
		rows.Scan(&u.ID, &u.Email, &u.IsEmailConfirmed, &u.LastIPAddresses, &u.LastUserAgent, &u.TwoFaPrivateKeyHash, &u.AuthProvider, &u.CreatedAt, &u.UpdatedAt, &u.DeletedAt)

		if u.IsDeleted() {
			return nil, errors.New("user is deleted")
		}

		user = &u
	}

	return user, nil
}

func InsertNew(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec("INSERT INTO public.user (id, email, is_email_confirmed, password_sha256, last_ip_addresses, last_user_agent, auth_provider) VALUES ($1, $2, $3, $4, $5, $6, $7)", &user.ID, &user.Email, &user.IsEmailConfirmed, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	if err != nil {
		return err
	}

	return nil
}
