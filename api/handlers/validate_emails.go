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
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	uploadedFile, uploadedFileHeader, err := r.FormFile("file")
	if err != nil && err != http.ErrMissingFile {
		log.Printf("Failed to parse request file: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	if uploadedFile != nil {
		defer uploadedFile.Close()
	}

	tokenClaims, err := middleware.ParseClaimsFromJWT(middleware.ExtractToken(r))
	if err != nil {
		log.Printf("Failed to parse request token claims: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	reportRecipient := tokenClaims.UserEmail

	if uploadedFileHeader != nil {
		handleFileUpload(w, uploadedFile, uploadedFileHeader, reportRecipient, r)
	} else {
		handleJSONRequest(w, r, reportRecipient)
	}
}

func handleFileUpload(w http.ResponseWriter, uploadedFile multipart.File, header *multipart.FileHeader, userEmail string, r *http.Request) {
	filePath := fmt.Sprintf("./uploads/%s", header.Filename)
	if err := file.SaveMultipart(header, filePath); err != nil {
		log.Printf("Failed to save uploaded file: %v", err)
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	fileExtension := models.FileExtension(strings.ToLower(strings.TrimPrefix(filepath.Ext(header.Filename), ".")))
	if !fileExtension.IsAllowed() {
		http.Error(w, "Invalid file extension", http.StatusBadRequest)
		return
	}

	go processFileValidation(uploadedFile, header, fileExtension, userEmail, r)
	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func handleJSONRequest(w http.ResponseWriter, r *http.Request, userEmail string) {
	req, err := email.ValidateValidationRequest(w, r)
	if err != nil {
		return // Error already handled in ValidateValidationRequest
	}

	go processEmailValidation(req.Emails, userEmail, r)
	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func processFileValidation(uploadedFile multipart.File, header *multipart.FileHeader, fileExtension models.FileExtension, userEmail string, r *http.Request) {
	validationRecord := createValidationRecord(&header.Filename, nil, r)
	go email.ValidateManyFromFileWithReport(uploadedFile, header, fileExtension, userEmail)
	insertValidationRecord(validationRecord)
}

func processEmailValidation(emails []string, userEmail string, r *http.Request) {
	logPath := fmt.Sprintf("./uploads/%s.csv", uuid.New().String())
	if err := file.SaveStringsToNewCSV(emails, logPath, utils.GetIPsFromRequest(r), time.Now()); err != nil {
		log.Printf("Failed to save request data: %v", err)
		return
	}

	validationRecord := createValidationRecord(nil, &logPath, r)
	go email.ValidateManyWithReport(emails, userEmail)
	insertValidationRecord(validationRecord)
}

func createValidationRecord(filename, logPath *string, r *http.Request) *models.Validation {
	var fn, lp string
	if filename != nil {
		fn = *filename
	} else if logPath != nil {
		lp = *logPath
	}

	return &models.Validation{
		ID:                        uuid.New(),
		UserID:                    middleware.GetUserIDFromRequest(r),
		Origin:                    middleware.GetOriginFromRequest(r),
		Type:                      models.BulkValidation,
		UploadFilename:            fn,
		RawBulkRequestLogFilepath: lp,
	}
}

func insertValidationRecord(v *models.Validation) {
	if err := validation.InsertNew(v); err != nil {
		log.Printf("Error inserting validation record: %v", err)
	}
}
