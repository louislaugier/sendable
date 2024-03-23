package config

import (
	"email-validator/internal/pkg/brevo"
	"os"
)

var EmailClient *brevo.EmailClient

func initTransactionalEmailsClient() {
	EmailClient = brevo.NewClient(os.Getenv("BREVO_API_KEY"))
}
