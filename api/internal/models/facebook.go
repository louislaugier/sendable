package models

type FacebookAuthRequest struct {
	AccessToken string `json:"access_token"`
}

type FacebookUser struct {
	Email string `json:"email"`
}
