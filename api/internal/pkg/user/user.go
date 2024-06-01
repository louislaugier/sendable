package user

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/subscription"
	"email-validator/internal/pkg/validation"
	"fmt"
	"log"

	"github.com/google/uuid"
)

const (
	insertQuery = "INSERT INTO public.user (id, email, is_email_confirmed, password_sha256, last_ip_addresses, last_user_agent, auth_provider) VALUES ($1, $2, $3, $4, $5, $6, $7);"

	selectQuery                   = `SELECT "id", "email", "is_email_confirmed", "email_confirmation_code", "2fa_secret", "created_at", "updated_at" FROM public."user" WHERE %s AND "deleted_at" IS NULL LIMIT 1;`
	selectUserByAPIKeySHA256Query = `SELECT "id", "email", "is_email_confirmed", "email_confirmation_code", "created_at", "updated_at" FROM public."user" WHERE "id" IN (SELECT "user_id" FROM public."api_key" WHERE "key_sha256" = $1 AND "deleted_at" IS NULL) AND "deleted_at" IS NULL LIMIT 1;`

	update2FASecretQuery             = "UPDATE public.user SET 2fa_secret = $1 WHERE id = $2;"
	updatePasswordSHA256Query        = "UPDATE public.user SET password_sha256 = $1 WHERE id = $2;"
	updateEmailAddressQuery          = "UPDATE public.user SET email = $1 WHERE id = $2;"
	updateEmailConfirmationQuery     = "UPDATE public.user SET is_email_confirmed = true WHERE id = $1;"
	updateEmailConfirmationCodeQuery = "UPDATE public.user SET email_confirmation_code = $1 WHERE id = $2;"

	updateIPsAndUserAgentQuery = "UPDATE public.user SET last_ip_addresses = $1, last_user_agent = $2 WHERE id = $3;"
)

// InsertNew inserts a new user into the database.
func InsertNew(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec(insertQuery, &user.ID, &user.Email, &user.IsEmailConfirmed, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	return err
}

func InsertNewTempZoho(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec(insertQuery, &user.ID, &user.Email, &user.IsEmailConfirmed, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	return err
}

// SetEmailConfirmed updates the is_email_confirmed field to true for a user with the given ID.
func SetEmailConfirmed(userID uuid.UUID) error {
	_, err := config.DB.Exec(updateEmailConfirmationQuery, userID)
	return err
}

func SetEmailConfirmationCode(userID uuid.UUID, emailConfirmationCode int) error {
	_, err := config.DB.Exec(updateEmailConfirmationCodeQuery, emailConfirmationCode, userID)
	return err
}

func UpdateEmailAddress(userID uuid.UUID, email string) error {
	_, err := config.DB.Exec(updateEmailAddressQuery, email, userID)
	return err
}

func UpdatePasswordSHA256(userID uuid.UUID, encryptedPassword string) error {
	_, err := config.DB.Exec(updatePasswordSHA256Query, encryptedPassword, userID)
	return err
}

func Set2FASecret(userID uuid.UUID, twoFactorAuthenticationSecret *string) error {
	_, err := config.DB.Exec(updatePasswordSHA256Query, twoFactorAuthenticationSecret, userID)
	return err
}

func UpdateIPsAndUserAgent(userID uuid.UUID, IPs, userAgent string) error {
	_, err := config.DB.Exec(updateIPsAndUserAgentQuery, IPs, userAgent, userID)
	return err
}

func GetByEmailAndConfirmationCode(email string, confirmationCode int) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = $1 AND email_confirmation_code = $2")
	return getByCriteria(false, query, email, confirmationCode)
}

// GetByEmailAndProvider retrieves a user by email and provider.
func GetByEmailAndProvider(email string, provider models.AuthProvider) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = $1 AND auth_provider = $2")
	return getByCriteria(false, query, email, provider)
}

// GetByEmailAndPasswordSHA256 retrieves a user by email and password SHA256 hash.
func GetByEmailAndPasswordSHA256(email, passwordSHA256 string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = $1 AND password_sha256 = $2")
	return getByCriteria(false, query, email, passwordSHA256)
}

// GetByID retrieves a user by ID.
func GetByID(ID uuid.UUID) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "id = $1")
	return getByCriteria(false, query, ID)
}

func GetByIDAndPasswordSHA256(ID uuid.UUID, passwordSHA256 string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "id = $1 AND password_sha256 = $2")
	return getByCriteria(false, query, ID, passwordSHA256)
}

// GetByTempZohoOauthData retrieves a user by temporary oauth data (Zoho flow).
func GetByTempZohoOauthData(comaSeparatedEmails string, lastIPs, lastUserAgent string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "email = $1 AND auth_provider = $2 AND last_ip_addresses = $3 AND last_user_agent = $4")
	return getByCriteria(false, query, comaSeparatedEmails, models.ZohoProvider, lastIPs, lastUserAgent)
}

// GetByAPIKeySHA256 retrieves a user by API key SHA256 hash.
func GetByAPIKeySHA256(apiKeySHA256 string) (*models.User, error) {
	return getByCriteria(false, selectUserByAPIKeySHA256Query, apiKeySHA256)
}

func getByCriteria(isMinimalQuery bool, query string, args ...interface{}) (*models.User, error) {
	rows, err := config.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var user *models.User

	for rows.Next() {
		u := models.User{}
		err = rows.Scan(&u.ID, &u.Email, &u.IsEmailConfirmed, &u.EmailConfirmationCode, &u.TwoFactorAuthSecret, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}
		if u.TwoFactorAuthSecret != nil {
			u.Is2FAEnabled = true
		}

		if !isMinimalQuery {
			currentPlan, err := subscription.GetLatestActive(u.ID)
			if err != nil {
				log.Printf("Error getting user's current plan: %v", err)
			} else if currentPlan != nil {
				u.CurrentPlan = currentPlan
			} else {
				u.CurrentPlan = models.EmptyFreePlan()
			}

			validationCounts, err := validation.GetCurrentMonthLimitCounts(u.ID)
			if err != nil {
				log.Printf("Error getting user's email validations counts for this month: %v", err)
			} else if validationCounts != nil {
				u.ValidationCounts = validationCounts
			}
		}

		user = &u
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return user, nil
}
