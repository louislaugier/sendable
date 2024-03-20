package models

type FacebookAuthRequest struct {
	AccessToken string `json:"access_token"`
}

type FacebookUser struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}
