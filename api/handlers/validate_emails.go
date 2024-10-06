package handlers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"sendable/config"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/email"
	"sendable/internal/pkg/file"
	"sendable/internal/pkg/utils"
	"sendable/internal/pkg/validation"

	"github.com/google/uuid"
)

// ValidateEmailsHandler handles the bulk email validation requests.
func ValidateEmailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var uploadFilename *string
	fileData := middleware.GetFileDataFromRequest(r)
	if fileData != nil {
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
	provider := r.URL.Query().Get("provider")
	if provider != "" {
		validationRecord.ProviderSource = (*models.ContactProviderType)(&provider)
	}

	err := validation.InsertNew(validationRecord)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var remainingEmailsCurrentMonth int
	origin := middleware.GetOriginFromRequest(r)
	user := middleware.GetUserFromRequest(r)
	if origin == config.FrontendURL {
		remainingEmailsCurrentMonth = user.ValidationCounts.AppValidationsCount
	} else {
		remainingEmailsCurrentMonth = user.ValidationCounts.APIValidationsCount
	}

	reportRecipientEmail := middleware.GetUserFromRequest(r).Email
	if fileData != nil {
		handleFileUpload(w, *fileData, userID, reportRecipientEmail, validationID, reportToken, remainingEmailsCurrentMonth)
	} else {
		handleJSONRequest(w, r, userID, reportRecipientEmail, validationID, reportToken, remainingEmailsCurrentMonth)
	}
}

func handleFileUpload(w http.ResponseWriter, fileData models.FileData, userID uuid.UUID, userEmail string, validationID, reportToken uuid.UUID, remainingEmailsCurrentMonth int) {
	fileExtension := utils.GetExtensionFromFilename(fileData.UploadedFileHeader.Filename)

	go email.ValidateManyFromFileWithReport(fileData, fileExtension, userID, userEmail, validationID, reportToken, remainingEmailsCurrentMonth)

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}

func handleJSONRequest(w http.ResponseWriter, r *http.Request, userID uuid.UUID, userEmail string, validationID, reportToken uuid.UUID, remainingEmailsCurrentMonth int) {
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

	go email.ValidateManyWithReport(req.Emails, userID, userEmail, validationID, reportToken, remainingEmailsCurrentMonth)

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
