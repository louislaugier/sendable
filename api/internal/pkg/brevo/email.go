package brevo

import (
	"context"
	"email-validator/internal/models"
	"email-validator/internal/pkg/html"
	"os"

	brevo "github.com/getbrevo/brevo-go/lib"
)

func (c *EmailClient) SendEmail(template models.Template, subject, previewContent string, variables map[string]string, recipients ...string) error {
	var to []brevo.SendSmtpEmailTo
	for _, recipient := range recipients {
		to = append(to, brevo.SendSmtpEmailTo{
			Email: recipient,
		})
	}

	HTML, err := html.GenerateEmail(template, variables)
	if err != nil {
		return err
	}

	_, _, err = c.TransactionalEmailsApi.SendTransacEmail(context.Background(), brevo.SendSmtpEmail{
		Sender: &brevo.SendSmtpEmailSender{
			Name:  os.Getenv("BREVO_SENDER_NAME"),
			Email: os.Getenv("BREVO_SENDER_EMAIL"),
		},
		To:          to,
		HtmlContent: HTML,
		TextContent: previewContent,
		Subject:     subject,
	})

	if err != nil {
		return err
	}

	return nil
}
