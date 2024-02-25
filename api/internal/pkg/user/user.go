package user

// func Create(u *models.User) (*models.User, error) {
// 	_, err := database.DB.Exec(`insert into public."user" ("walletAddress","avatarUrl","ip","createdAt") values ($1,$2,$3,$4);`, u.WalletAddress, u.AvatarURL, u.IP, time.Now())
// 	if err != nil {
// 		log.Println(err)
// 		return nil, err
// 	}

// 	return u, nil
// }

// func Login(u *models.User) (*models.User, error) {
// 	_, err := database.DB.Exec(`insert into public."user" ("walletAddress","avatarUrl","ip","createdAt") values ($1,$2,$3,$4);`, u.WalletAddress, u.AvatarURL, u.IP, time.Now())
// 	if err != nil {
// 		log.Println(err)
// 		return nil, err
// 	}

// 	return u, nil
// }
