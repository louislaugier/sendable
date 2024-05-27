package handlers

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"email-validator/config"
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/utils"
	"email-validator/internal/pkg/validation"

	"github.com/google/uuid"
)

// validateEmailsHandler handles the email validation requests.
func validateEmailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var uploadFilename *string
	fileData := middleware.GetFileDataFromRequest(r)
	if fileData.UploadedFile != nil {
		uploadFilename = &fileData.UploadedFileHeader.Filename
		defer fileData.UploadedFile.Close()
	}

	userID := middleware.GetUserFromRequest(r).ID
	validationID := uuid.New()
	reportToken := uuid.New()

	validationRecord := &models.Validation{
		ID:             validationID,
		UserID:         &userID,
		Origin:         middleware.GetValidationOriginType(middleware.GetOriginFromRequest(r)),
		UploadFilename: uploadFilename,
		ReportToken:    &reportToken,
		Status:         models.StatusProcessing,
	}

	err := validation.InsertNew(validationRecord)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var remainingEmails int
	origin := middleware.GetOriginFromRequest(r)
	user := middleware.GetUserFromRequest(r)
	if origin == config.FrontendURL {
		remainingEmails = user.ValidationCounts.AppValidationsCount
	} else {
		remainingEmails = user.ValidationCounts.APIValidationsCount
	}

	reportRecipientEmail := middleware.GetUserFromRequest(r).Email
	if fileData.UploadedFileHeader != nil {
		handleFileUpload(w, fileData.UploadedFile, fileData.UploadedFileHeader, userID, reportRecipientEmail, validationID, reportToken, remainingEmails)
	} else {
		handleJSONRequest(w, r, userID, reportRecipientEmail, validationID, reportToken, remainingEmails)
	}
}

func handleFileUpload(w http.ResponseWriter, uploadedFile multipart.File, header *multipart.FileHeader, userID uuid.UUID, userEmail string, validationID, reportToken uuid.UUID, remainingEmails int) {
	fileExtension := utils.GetExtensionFromFilename(header.Filename)

	go email.ValidateManyFromFileWithReport(uploadedFile, header, fileExtension, userID, userEmail, validationID, reportToken, remainingEmails)

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func handleJSONRequest(w http.ResponseWriter, r *http.Request, userID uuid.UUID, userEmail string, validationID, reportToken uuid.UUID, remainingEmails int) {
	req, err := email.ValidateValidationRequest(w, r)
	if err != nil {
		return // Error already handled in ValidateValidationRequest
	}

	go func() {
		if err := file.SaveStringsToNewCSV(req.Emails, fmt.Sprintf("./files/json_bulk_validation_logs/%s.csv", validationID), utils.GetIPsFromRequest(r), time.Now()); err != nil {
			log.Printf("Failed to save request data: %v", err)
			return
		}
	}()

	go email.ValidateManyWithReport(req.Emails, userID, userEmail, validationID, reportToken, remainingEmails)

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
