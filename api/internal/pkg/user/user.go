package user

// func Create(u *models.User) (*models.User, error) {
// 	_, err := database.DB.Exec(`insert into public."user" ("walletAddress","avatarUrl","ip","createdAt") values ($1,$2,$3,$4);`, u.WalletAddress, u.AvatarURL, u.IP, time.Now())
// 	if err != nil {
// 		log.Println(err)
// 		return nil, err
// 	}

// 	return u, nil
// }

// func Login(user *models.User) error {
// 	rows, err := config.DB.Query(`SELECT "id" FROM public."user" WHERE "deletedAt" IS NULL LIMIT 1;`)
// 	if err != nil {
// 		return err
// 	}

// 	defer rows.Close()
// 	u := &models.User{}
// 	for rows.Next() {
// 		rows.Scan(u.ID)
// 	}
// 	isUserFound := u != nil

// 	jwt, err := middleware.GenerateJWT(u.ID.String())
// 	if err != nil {
// 		log.Println(err)
// 		return err
// 	}

// 	u.JWT = *jwt

// 	return nil
// }

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
