package email

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/validation"
	"fmt"
	"log"
	"mime/multipart"

	"github.com/google/uuid"
)

func updateValidationStatus(err error, validationID uuid.UUID) error {
	var status models.ValidationStatus
	if err != nil {
		status = models.StatusFailed
	} else {
		status = models.StatusCompleted
	}

	return validation.UpdateStatus(validationID, status)
}

func ValidateManyWithReport(emails []string, reportRecipient string, validationID uuid.UUID) {
	report, err := ValidateMany(emails)
	handleValidationReport(report, err, reportRecipient, validationID)
}

func ValidateManyFromFileWithReport(uploadedFile multipart.File, uploadedFileHeader *multipart.FileHeader, extension models.FileExtension, reportRecipient string, validationID uuid.UUID) {
	report, err := ValidateManyFromFile(uploadedFile, uploadedFileHeader, extension)
	handleValidationReport(report, err, reportRecipient, validationID)
}

func handleValidationReport(report []models.ReacherResponse, err error, recipient string, validationID uuid.UUID) {
	if err != nil {
		log.Printf("Error during validation: %v", err)
		sendReportError(recipient)
	} else {
		sendReport(report, recipient, validationID)
	}

	if updateErr := updateValidationStatus(err, validationID); updateErr != nil {
		log.Printf("Error updating validation status: %v", updateErr)
	}
}

// sendReport sends a report by email to recipient
func sendReport(report []models.ReacherResponse, recipient string, ID uuid.UUID) {
	filePath, err := file.CreateCSVReport(report, ID)
	if err != nil {
		log.Printf("Error creating report: %v", err)
		return
	}

	zipFile, err := file.ToZIP(filePath)
	if err != nil {
		log.Printf("Error converting report to ZIP: %v", err)
		return
	}
	zipFile.Close() // Make sure to close the ZIP file when you're done

	token, _, err := file.CreateJSONReportToken(ID)
	if err != nil {
		log.Printf("Error creating report token: %v", err)
		return
	}

	err = config.EmailClient.SendEmail(models.ReportTemplate, "Email validation report", "Your email validation report is ready!", map[string]string{
		"id":     ID.String(),
		"token":  token.String(),
		"domain": fmt.Sprintf("%s%s", config.DomainURL, config.APIVersionPrefix),
	}, recipient)
	if err != nil {
		log.Printf("Error sending report: %v", err)
		return
	}
}

// sendReportError sends a report error by email to recipient
func sendReportError(recipient string) {
	err := config.EmailClient.SendEmail(models.ErrorTemplate, "Email validation error", "Issues while attempting to validate emails.", nil, recipient)
	if err != nil {
		log.Printf("Error sending report error: %v", err)
		return
	}
}
