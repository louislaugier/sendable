package models

type LinkedinAuthRequest struct {
	Code string `json:"code"`
}

type LinkedinUser struct {
	Email string `json:"email"`
}
