package models

type SalesforceAuthRequest struct {
	Code         string `json:"code"`
	CodeVerifier string `json:"code_verifier"`
}
