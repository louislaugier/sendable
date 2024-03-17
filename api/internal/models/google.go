package models

type GoogleAuthRequest struct {
	AccessToken string `json:"access_token"`
	Credential  string `json:"credential"`
}
