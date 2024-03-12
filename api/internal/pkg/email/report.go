package email

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/brevo"
	"email-validator/internal/pkg/file"
	"log"
	"mime/multipart"

	"github.com/google/uuid"
)

// ValidateManyWithReport consumes ValidateMany and sends a report by email
func ValidateManyWithReport(emails []string, reportRecipient string) {
	report, err := ValidateMany(emails)

	if err != nil {
		log.Printf("Error validating many with report: %v", err)
		sendReportError(reportRecipient)
	}

	sendReport(report, reportRecipient)
}

// ValidateManyFromFileWithReport consumes ValidateManyFromFile and sends a report by email
func ValidateManyFromFileWithReport(uploadedFile multipart.File, uploadedFileHeader *multipart.FileHeader, extension models.FileExtension, reportRecipient string) {
	report, err := ValidateManyFromFile(uploadedFile, uploadedFileHeader, extension)

	if err != nil {
		log.Printf("Error validating many from file with report: %v", err)
		sendReportError(reportRecipient)
	}

	sendReport(report, reportRecipient)
}

// sendReport sends a report by email to recipient
func sendReport(report []models.ReacherResponse, recipient string) {
	ID := uuid.New()

	f, err := file.CreateCSVReport(report, ID)
	if err != nil {
		log.Printf("Error creating report: %v", err)
		return
	}

	_, err = file.ToZIP(f)
	if err != nil {
		log.Printf("Error creating report: %v", err)
		return
	}

	err = brevo.Client.SendEmail(models.ReportTemplate, "Your email validation report", "Preview text", map[string]string{
		"id": ID.String(),
	}, recipient)
	if err != nil {
		log.Printf("Error sending report: %v", err)
		return
	}
}

// sendReportError sends a report error by email to recipient
func sendReportError(recipient string) {
	err := brevo.Client.SendEmail(models.ErrorTemplate, "Your email validation report", "Preview text", map[string]string{}, recipient)
	if err != nil {
		log.Printf("Error sending report error: %v", err)
		return
	}
}
