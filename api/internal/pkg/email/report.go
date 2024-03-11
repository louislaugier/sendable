package email

import (
	"email-validator/internal/models"
	"log"
	"mime/multipart"
)

// ValidateManyWithReport consumes ValidateMany and sends a report by email
func ValidateManyWithReport(emails []string, reportRecipient string) {
	report, err := ValidateMany(emails)

	if err != nil {
		log.Printf("Error validating many with report: %v", err)
		sendReportError(report, reportRecipient)
	}

	sendReport(report, reportRecipient)
}

// ValidateManyFromFileWithReport consumes ValidateManyFromFile and sends a report by email
func ValidateManyFromFileWithReport(uploadedFile multipart.File, uploadedFileHeader *multipart.FileHeader, extension models.FileExtension, reportRecipient string) {
	report, err := ValidateManyFromFile(uploadedFile, uploadedFileHeader, extension)

	if err != nil {
		log.Printf("Error validating many from file with report: %v", err)
		sendReportError(report, reportRecipient)
	}

	sendReport(report, reportRecipient)
}

// sendReport sends a report by email to recipient with 1 retry if needed
func sendReport(report []models.ReacherResponse, recipient string) {

}

// sendReportError sends a report error by email to recipient with 1 retry if needed
func sendReportError(report []models.ReacherResponse, recipient string) {
}
