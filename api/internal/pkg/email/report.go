package email

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/validation"
	"fmt"
	"log"

	"github.com/google/uuid"
)

func ValidateManyWithReport(emails []string, userID uuid.UUID, reportRecipientEmail string, validationID, reportToken uuid.UUID, remainingEmailsCurrentMonth int) {
	report, err := ValidateMany(emails)

	if len(report) > remainingEmailsCurrentMonth {
		report = report[:remainingEmailsCurrentMonth]
	}

	handleValidationReport(report, err, userID, reportRecipientEmail, validationID, reportToken)
}

func ValidateManyFromFileWithReport(fileData models.FileData, extension models.FileExtension, userID uuid.UUID, reportRecipientEmail string, validationID, reportToken uuid.UUID, remainingEmailsCurrentMonth int) {
	report, err := ValidateManyFromFile(fileData, extension)

	if len(report) > remainingEmailsCurrentMonth {
		report = report[:remainingEmailsCurrentMonth]
	}

	handleValidationReport(report, err, userID, reportRecipientEmail, validationID, reportToken)
}

func handleValidationReport(report []models.ReacherResponse, err error, userID uuid.UUID, recipientEmail string, validationID, token uuid.UUID) {
	if err != nil {
		log.Printf("Error during validation: %v", err)
		sendReportError(recipientEmail)
	} else {
		sendReport(report, recipientEmail, validationID, token)
	}

	if updateErr := updateValidationStatus(err, validationID, len(report)); updateErr != nil {
		log.Printf("Error updating validation status: %v", updateErr)
	} else {
		// Release the lock only after successfully updating the status
		middleware.ReleaseBulkValidationLock(userID)
	}
}

// sendReport sends a report by email to recipient
func sendReport(report []models.ReacherResponse, recipient string, ID, token uuid.UUID) {
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

	_, err = file.CreateJSONReportTokenFile(ID, token)
	if err != nil {
		log.Printf("Error creating report token: %v", err)
		return
	}

	err = config.EmailClient.SendEmail(models.EmailValidationReportTemplate, "Email validation report", "Your email validation report is ready!", map[string]string{
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
	err := config.EmailClient.SendEmail(models.EmailValidationErrorTemplate, "Email validation error", "Issues while attempting to validate emails.", nil, recipient)
	if err != nil {
		log.Printf("Error sending report error: %v", err)
		return
	}
}

func updateValidationStatus(err error, validationID uuid.UUID, bulkAddressCount int) error {
	var status models.ValidationStatus
	if err != nil {
		status = models.StatusFailed
	} else {
		status = models.StatusCompleted
	}

	return validation.UpdateStatus(validationID, status, &bulkAddressCount)
}
