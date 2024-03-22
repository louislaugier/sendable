package brevo

import (
	"os"

	brevo "github.com/getbrevo/brevo-go/lib"
)

type EmailClient brevo.APIClient

var Client *EmailClient

func NewClient() *EmailClient {
	cfg := brevo.NewConfiguration()
	cfg.AddDefaultHeader("api-key", os.Getenv("BREVO_API_KEY"))

	bc := brevo.NewAPIClient(cfg)

	return (*EmailClient)(bc)
}
