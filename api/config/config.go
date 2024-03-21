package config

import (
	"email-validator/internal/pkg/brevo"
	"os"
)

var Domain string
var FrontendURL string

func Load() {
	Domain = os.Getenv("DOMAIN")
	if os.Getenv("ENV") == "DEV" {
		Domain = "http://localhost"
	}

	LoadEnv()

	FrontendURL = os.Getenv("FRONTEND_URL")

	LoadOauthClients()

	brevo.Client = brevo.NewClient()
}
