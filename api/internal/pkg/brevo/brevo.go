package brevo

import (
	"os"

	brevo "github.com/getbrevo/brevo-go/lib"
)

func NewBrevoClient() *brevo.APIClient {
	cfg := brevo.NewConfiguration()
	cfg.AddDefaultHeader("api-key", os.Getenv("BREVO_API_KEY"))

	bc := brevo.NewAPIClient(cfg)

	return bc
}
