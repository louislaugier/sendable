package user

import (
	"fmt"
	"log"

	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/order"

	"github.com/google/uuid"
)

const (
	insertQuery = "INSERT INTO public.user (id, email, is_email_confirmed, password_sha256, last_ip_addresses, last_user_agent, auth_provider) VALUES (?, ?, ?, ?, ?, ?, ?)"

	selectQuery = `SELECT "id", "email", "is_email_confirmed", "email_confirmation_code", "created_at", "updated_at" FROM public."user" WHERE %s AND "deleted_at" IS NULL LIMIT 1`

	updateEmailConfirmationQuery = "UPDATE public.user SET is_email_confirmed = true WHERE id = ?"
)

// InsertNew inserts a new user into the database.
func InsertNew(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec(insertQuery, &user.ID, &user.Email, &user.IsEmailConfirmed, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	return err
}

// SetEmailConfirmed updates the is_email_confirmed field to true for a user with the given ID.
func SetEmailConfirmed(userID uuid.UUID) error {
	_, err := config.DB.Exec(updateEmailConfirmationQuery, userID)
	return err
}

func GetByEmailAndConfirmationCode(email string, confirmationCode int) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = ? AND email_confirmation_code = ?")
	return getByCriteria(query, email, confirmationCode)
}

// GetByEmailAndProvider retrieves a user by email and provider.
func GetByEmailAndProvider(email string, provider models.AuthProvider) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = ? AND auth_provider = ?")
	return getByCriteria(query, email, provider)
}

// GetByEmailAndPasswordSHA256 retrieves a user by email and password SHA256 hash.
func GetByEmailAndPasswordSHA256(email, passwordSHA256 string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = ? AND password_sha256 = ?")
	return getByCriteria(query, email, passwordSHA256)
}

// GetByID retrieves a user by ID.
func GetByID(ID uuid.UUID) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "id = ?")
	return getByCriteria(query, ID)
}

// GetByTempZohoOauthData retrieves a user by temporary oauth data (Zoho flow).
func GetByTempZohoOauthData(comaSeparatedEmails string, lastIPs, lastUserAgent string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = ? AND auth_provider = ? AND last_ip_addresses = ? AND last_user_agent = ?")
	return getByCriteria(query, comaSeparatedEmails, models.ZohoProvider, lastIPs, lastUserAgent)
}

func InsertNewTempZoho(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec(insertQuery, &user.ID, &user.Email, &user.IsEmailConfirmed, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	return err
}

func getByCriteria(query string, args ...interface{}) (*models.User, error) {
	rows, err := config.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var user *models.User

	for rows.Next() {
		u := models.User{}
		err = rows.Scan(&u.ID, &u.Email, &u.IsEmailConfirmed, &u.EmailConfirmationCode, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}

		currentPlan, err := order.GetLatestActiveOrder(u.ID)
		if err != nil {
			log.Println("Error getting user's current plan:", err)
		} else {
			u.CurrentPlan = currentPlan
		}

		user = &u
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return user, nil
}
