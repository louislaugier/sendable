package brevo

import (
	brevo "github.com/getbrevo/brevo-go/lib"
)

type EmailClient brevo.APIClient

func NewEmailClient(APIKey string) *EmailClient {
	return (*EmailClient)(NewClient(APIKey))
}

func NewClient(APIKey string) *brevo.APIClient {
	cfg := brevo.NewConfiguration()
	cfg.AddDefaultHeader("api-key", APIKey)

	bc := brevo.NewAPIClient(cfg)

	return bc
}
