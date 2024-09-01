package user

import (
	"database/sql"
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/subscription"
	"email-validator/internal/pkg/validation"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)

const (
	insertQuery = "INSERT INTO public.user (id, email, is_email_confirmed, email_confirmation_code, password_sha256, last_ip_addresses, last_user_agent, auth_provider) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);"

	selectQuery = `
		SELECT 
			u."id", 
			u."email", 
			u."auth_provider", 
			u."is_email_confirmed", 
			u."email_confirmation_code", 
			u."2fa_secret", 
			u."stripe_customer_id", 
			u."created_at", 
			u."updated_at",
			json_agg(json_build_object(
				'id', cp."id",
				'type', cp."type",
				'apiKey', cp."api_key",
				'createdAt', to_char(cp."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
				'updatedAt', to_char(cp."updated_at", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
			)) AS contact_providers
		FROM 
			public."user" u
		LEFT JOIN 
			public."contact_provider" cp ON u."id" = cp."user_id"
		LEFT JOIN 
			public."subscription" s ON u."id" = s."user_id"
		WHERE
			%s
			AND
			(
				(u."deleted_at" IS NOT NULL AND u."deleted_at" >= current_timestamp - interval '30 days' AND s."cancelled_at" IS NULL) 
				OR 
				(u."deleted_at" IS NULL)
			)
		GROUP BY 
			u."id", 
			u."email", 
			u."auth_provider", 
			u."is_email_confirmed", 
			u."email_confirmation_code", 
			u."2fa_secret", 
			u."stripe_customer_id", 
			u."created_at", 
			u."updated_at"
		;
	`

	select2FASecretQuery = `SELECT "2fa_secret" FROM public."user" WHERE "id" = $1 AND "deleted_at" IS NULL LIMIT 1;`

	set2FASecretQuery = `UPDATE public.user SET "2fa_secret" = $1 WHERE id = $2;`
	disable2FAQuery   = `UPDATE public.user SET "2fa_secret" = NULL WHERE id = $1;`

	updatePasswordSHA256Query        = `UPDATE public.user SET "password_sha256" = $1 WHERE id = $2;`
	updateEmailAddressQuery          = `UPDATE public.user SET "email" = $1 WHERE id = $2;`
	updateEmailConfirmationQuery     = `UPDATE public.user SET "is_email_confirmed" = true, "email_confirmation_code" = NULL WHERE id = $1;`
	updateEmailConfirmationCodeQuery = `UPDATE public.user SET "email_confirmation_code" = $1 WHERE id = $2;`
	updateStripeCustomerID           = `UPDATE public.user SET "stripe_customer_id" = $1 WHERE id = $1;`

	updateIPsAndUserAgentQuery = "UPDATE public.user SET last_ip_addresses = $1, last_user_agent = $2 WHERE id = $3;"

	deleteQuery = "UPDATE public.user SET deleted_at = now() WHERE id = $1;"
)

// InsertNew inserts a new user into the database.
func InsertNew(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec(insertQuery, &user.ID, &user.Email, &user.IsEmailConfirmed, &user.EmailConfirmationCode, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	return err
}

func InsertNewTempZoho(user *models.User, encryptedPassword *string) error {
	_, err := config.DB.Exec(insertQuery, &user.ID, &user.Email, &user.IsEmailConfirmed, &user.EmailConfirmationCode, encryptedPassword, &user.LastIPAddresses, &user.LastUserAgent, &user.AuthProvider)
	return err
}

func SetStripeCustomerID(userID uuid.UUID, stripeCustomerID string) error {
	_, err := config.DB.Exec(updateStripeCustomerID, stripeCustomerID, userID)
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
	_, err := config.DB.Exec(set2FASecretQuery, twoFactorAuthenticationSecret, userID)
	return err
}

func Disable2FA(userID uuid.UUID) error {
	_, err := config.DB.Exec(disable2FAQuery, userID)
	return err
}

func Delete(userID uuid.UUID) error {
	_, err := config.DB.Exec(deleteQuery, userID)
	return err
}

func Reactivate(userID uuid.UUID) error {
	_, err := config.DB.Exec(deleteQuery, nil, userID)
	return err
}

func UpdateIPsAndUserAgent(userID uuid.UUID, IPs, userAgent string) error {
	_, err := config.DB.Exec(updateIPsAndUserAgentQuery, IPs, userAgent, userID)
	return err
}

func GetByEmail(email string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.email = $1")
	return getByCriteria(false, query, email)
}

func GetByStripeCustomerID(stripeCustomerID string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.stripe_customer_id = $1")
	return getByCriteria(false, query, stripeCustomerID)
}

func GetByEmailAndConfirmationCode(email string, confirmationCode int) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.email = $1 AND u.email_confirmation_code = $2")
	return getByCriteria(false, query, email, confirmationCode)
}

// GetByEmailAndProvider retrieves a user by email and provider.
func GetByEmailAndProvider(email string, provider models.AuthProvider) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.email = $1 AND u.auth_provider = $2")
	return getByCriteria(false, query, email, provider)
}

// GetByEmailAndPasswordSHA256 retrieves a user by email and password SHA256 hash.
func GetByEmailAndPasswordSHA256(email, passwordSHA256 string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.email = $1 AND u.password_sha256 = $2")
	return getByCriteria(false, query, email, passwordSHA256)
}

// GetByID retrieves a user by ID.
func GetByID(ID uuid.UUID) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.id = $1")
	return getByCriteria(false, query, ID)
}

func GetByIDAndPasswordSHA256(ID uuid.UUID, passwordSHA256 string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.id = $1 AND u.password_sha256 = $2")
	return getByCriteria(false, query, ID, passwordSHA256)
}

// GetByTempZohoOauthData retrieves a user by temporary oauth data (Zoho flow).
func GetByTempZohoOauthData(comaSeparatedEmails string, lastIPs, lastUserAgent string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, "u.email = $1 AND u.auth_provider = $2 AND u.last_ip_addresses = $3 AND u.last_user_agent = $4")
	return getByCriteria(false, query, comaSeparatedEmails, models.ZohoProvider, lastIPs, lastUserAgent)
}

// GetByAPIKeySHA256 retrieves a user by API key SHA256 hash.
func GetByAPIKeySHA256(APIKeySHA256 string) (*models.User, error) {
	query := fmt.Sprintf(selectQuery, `"u.id" IN (SELECT "user_id" FROM public."api_key" WHERE "key_sha256" = $1 AND "deleted_at" IS NULL)`)
	return getByCriteria(false, query, APIKeySHA256)
}

func getByCriteria(isMinimalResponse bool, query string, args ...interface{}) (*models.User, error) {
	rows, err := config.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var user *models.User

	for rows.Next() {
		u := models.User{}
		var contactProvidersJSON []byte
		var createdAt, updatedAt sql.NullTime
		err = rows.Scan(&u.ID, &u.Email, &u.AuthProvider, &u.IsEmailConfirmed, &u.EmailConfirmationCode,
			&u.TwoFactorAuthSecret, &u.StripeCustomerID, &createdAt, &updatedAt, &contactProvidersJSON)
		if err != nil {
			return nil, err
		}

		// Convert sql.NullTime to time.Time
		if createdAt.Valid {
			u.CreatedAt = &createdAt.Time
		}
		if updatedAt.Valid {
			u.UpdatedAt = &updatedAt.Time
		}

		// Unmarshal JSON array into slice of ContactProvider
		var cp []models.ContactProvider
		err = json.Unmarshal(contactProvidersJSON, &cp)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling contact providers: %v", err)
		}

		contactProviders := []models.ContactProvider{}
		for _, c := range cp {
			if c.APIKey != nil {
				contactProviders = append(contactProviders, c)
			}
		}

		for i := range contactProviders {
			// Convert strings to time.Time for createdAt and updatedAt
			t, err := time.Parse(time.RFC3339, contactProviders[i].CreatedAt.String())
			if err == nil {
				contactProviders[i].CreatedAt = t
			}

			if contactProviders[i].UpdatedAt != nil {
				t, err := time.Parse(time.RFC3339, contactProviders[i].UpdatedAt.String())
				if err == nil {
					contactProviders[i].UpdatedAt = &t
				}
			}

			contactProviders[i].UserID = u.ID
		}

		u.ContactProviders = contactProviders
		if u.TwoFactorAuthSecret != nil {
			u.Is2FAEnabled = true
		}

		if !isMinimalResponse {
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
