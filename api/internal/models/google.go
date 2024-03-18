package models

type GoogleAuthRequest struct {
	AccessToken string `json:"access_token"`
	JWT         string `json:"jwt"`
}
