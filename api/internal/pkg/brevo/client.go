package brevo

import (
	brevo "github.com/getbrevo/brevo-go/lib"
)

type EmailClient brevo.APIClient

func NewClient(APIKey string) *EmailClient {
	cfg := brevo.NewConfiguration()
	cfg.AddDefaultHeader("api-key", APIKey)

	bc := brevo.NewAPIClient(cfg)

	return (*EmailClient)(bc)
}
