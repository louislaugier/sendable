package models

type SalesforceAuthRequest struct {
	Code         string `json:"code"`
	CodeVerifier string `json:"code_verifier"`
}

type SalesforceUser struct {
	Email    string `json:"email"`
	Contacts string `json:"contacts"`
}
