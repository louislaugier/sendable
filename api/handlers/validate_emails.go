package handlers

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
	"time"

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

	uploadedFile, uploadedFileHeader, err := r.FormFile("file")
	if err != nil && r.Header.Get("Content-Type") == "multipart/form-data" {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if uploadedFile != nil {
		defer uploadedFile.Close()
	}

	validationID := uuid.New()
	validationRecord := createValidationRecord(nil, validationID, r)

	err = validation.InsertNew(validationRecord)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	reportRecipient := middleware.GetUserFromRequest(r).Email
	if uploadedFileHeader != nil {
		handleFileUpload(w, uploadedFile, uploadedFileHeader, reportRecipient, r, validationID)
	} else {
		handleJSONRequest(w, r, reportRecipient, validationID)
	}
}

func handleFileUpload(w http.ResponseWriter, uploadedFile multipart.File, header *multipart.FileHeader, userEmail string, r *http.Request, validationID uuid.UUID) {
	filePath := fmt.Sprintf("./files/bulk_validation_uploads/%s", header.Filename)

	go func() {
		if err := file.SaveMultipart(header, filePath); err != nil {
			log.Printf("Failed to save uploaded file: %v", err)
			http.Error(w, "Failed to save file", http.StatusInternalServerError)
			return
		}
	}()

	fileExtension := models.FileExtension(strings.ToLower(strings.TrimPrefix(filepath.Ext(header.Filename), ".")))
	if !fileExtension.IsAllowed() {
		http.Error(w, "Invalid file extension", http.StatusBadRequest)
		return
	}

	go processValidationFromFile(uploadedFile, header, fileExtension, userEmail, r, validationID)

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func handleJSONRequest(w http.ResponseWriter, r *http.Request, userEmail string, validationID uuid.UUID) {
	req, err := email.ValidateValidationRequest(w, r)
	if err != nil {
		return // Error already handled in ValidateValidationRequest
	}

	go processValidationFromJSON(req.Emails, userEmail, r, validationID)

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func processValidationFromFile(uploadedFile multipart.File, header *multipart.FileHeader, fileExtension models.FileExtension, userEmail string, r *http.Request, validationID uuid.UUID) {
	// TODO: like processValidationFromJSON but save to /files/uploads
	go email.ValidateManyFromFileWithReport(uploadedFile, header, fileExtension, userEmail, validationID)
}

func processValidationFromJSON(emails []string, reportRecipient string, r *http.Request, validationID uuid.UUID) {

	go func() {
		if err := file.SaveStringsToNewCSV(emails, fmt.Sprintf("./files/json_bulk_validation_logs/%s.csv", validationID), utils.GetIPsFromRequest(r), time.Now()); err != nil {
			log.Printf("Failed to save request data: %v", err)
			return
		}
	}()

	go email.ValidateManyWithReport(emails, reportRecipient, validationID)
}

func createValidationRecord(filename *string, ID uuid.UUID, r *http.Request) *models.Validation {
	return &models.Validation{
		ID:             ID,
		UserID:         &middleware.GetUserFromRequest(r).ID,
		Origin:         middleware.GetValidationOriginType(middleware.GetOriginFromRequest(r)),
		UploadFilename: filename,
	}
}
