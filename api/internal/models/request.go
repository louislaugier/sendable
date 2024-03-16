package models

type ValidateEmailRequest struct {
	Email *string `json:"email"`
}

type ValidateEmailsRequest struct {
	Emails []string `json:"emails,omitempty"`
}
