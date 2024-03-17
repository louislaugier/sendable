package config

import (
	"email-validator/internal/pkg/brevo"
	"os"
)

var Domain string

func Load() {
	Domain = os.Getenv("DOMAIN")
	if os.Getenv("ENV") == "DEV" {
		Domain = "http://localhost"
	}

	LoadEnv()

	brevo.Client = brevo.NewClient()
}
