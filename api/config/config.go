package config

import "email-validator/internal/pkg/brevo"

func Load() {
	LoadEnv()

	brevo.Client = *brevo.NewClient()
}
