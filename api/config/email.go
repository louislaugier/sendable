package config

import (
	"sendable/internal/pkg/brevo"
	"os"
)

var EmailClient *brevo.EmailClient

func initTransactionalEmailsClient() {
	EmailClient = brevo.NewEmailClient(os.Getenv("BREVO_API_KEY"))
}
