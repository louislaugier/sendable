package user

import (
	"email-validator/config"
	"email-validator/internal/models"
	"fmt"
)

func GetByEmailAndProvider(email string, provider models.AuthProvider) (*models.User, error) {
	rows, err := config.DB.Query(fmt.Sprintf(`SELECT "id", "email", "is_email_confirmed", "password_sha256", "last_ip_addresses", "last_user_agent", "two_fa_private_key_hash", "auth_provider", "created_at", "updated_at", "deleted_at" FROM public."user" WHERE "email" = '%s' AND "auth_provider" = '%s' LIMIT 1;`, email, provider))

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var user *models.User

	for rows.Next() {
		u := models.User{}
		rows.Scan(&u.ID, &u.Email, &u.IsEmailConfirmed, &u.Password, &u.LastIPAddresses, &u.LastUserAgent, &u.TwoFaPrivateKeyHash, &u.AuthProvider, &u.CreatedAt, &u.UpdatedAt, &u.DeletedAt)
		user = &u
	}

	return user, nil
}

// func updateSomethingWithTx(DB *sql.DB) error {
// 	// Start a new transaction
// 	tx, err := DB.Begin()
// 	if err != nil {
// 		return err
// 	}
// 	// Defer a rollback in case something fails. The rollback will be ignored if the
// 	// transaction has already been committed.
// 	defer tx.Rollback()

// 	// Execute some database commands within the transaction
// 	if _, err := tx.Exec("UPDATE my_table SET column = value WHERE condition"); err != nil {
// 		// Handle error and exit function, which triggers deferred rollback
// 		return err
// 	}
//     // You can add more Exec or other transactional operations here if needed

// 	// If everything went fine, commit the transaction
// 	if err := tx.Commit(); err != nil {
// 		return err
// 	}

// 	// Transaction was successful, no need to rollback
// 	return nil
// }
