package brevo

import (
	"context"
	"email-validator/internal/models"
	"email-validator/internal/pkg/html"
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

func (c *EmailClient) SendEmail(template models.Template, subject, previewContent string, variables map[string]string,
	// attachments []*os.File,
	recipients ...string) error {

	var to []brevo.SendSmtpEmailTo
	for _, recipient := range recipients {
		to = append(to, brevo.SendSmtpEmailTo{
			Email: recipient,
		})
	}

	// var files []brevo.SendSmtpEmailAttachment
	// for _, attachment := range attachments {
	// 	fileContent, err := file.ToBase64(attachment)
	// 	if err != nil {
	// 		return err
	// 	}

	// 	files = append(files, brevo.SendSmtpEmailAttachment{
	// 		Name:    attachment.Name(),
	// 		Content: *fileContent,
	// 	})
	// }

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
		// Attachment:  files,
	})

	if err != nil {
		return err
	}

	return nil
}
