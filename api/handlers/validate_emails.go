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
	reportID := uuid.New()
	if uploadedFileHeader != nil {
		handleFileUpload(w, uploadedFile, uploadedFileHeader, reportRecipient, r, reportID)
	} else {
		handleJSONRequest(w, r, reportRecipient, reportID)
	}
}

func handleFileUpload(w http.ResponseWriter, uploadedFile multipart.File, header *multipart.FileHeader, userEmail string, r *http.Request, reportID uuid.UUID) {
	filePath := fmt.Sprintf("./uploads/%s", header.Filename)

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

	if err := processFileValidation(uploadedFile, header, fileExtension, userEmail, r, reportID); err != nil {
		log.Printf("Error processing file validation: %v", err)
		http.Error(w, "Failed to process file validation", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func handleJSONRequest(w http.ResponseWriter, r *http.Request, userEmail string, reportID uuid.UUID) {
	req, err := email.ValidateValidationRequest(w, r)
	if err != nil {
		return // Error already handled in ValidateValidationRequest
	}

	go processEmailValidation(req.Emails, userEmail, r, reportID)

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func processFileValidation(uploadedFile multipart.File, header *multipart.FileHeader, fileExtension models.FileExtension, userEmail string, r *http.Request, reportID uuid.UUID) error {
	validationRecord := createValidationRecord(&header.Filename, nil, r)
	go email.ValidateManyFromFileWithReport(uploadedFile, header, fileExtension, userEmail, reportID)

	if err := insertValidationRecord(validationRecord); err != nil {
		return err
	}

	return nil
}

func processEmailValidation(emails []string, reportRecipient string, r *http.Request, reportID uuid.UUID) {
	logPath := fmt.Sprintf("./uploads/%s.csv", uuid.New().String())

	go func() {
		if err := file.SaveStringsToNewCSV(emails, logPath, utils.GetIPsFromRequest(r), time.Now()); err != nil {
			log.Printf("Failed to save request data: %v", err)
			return
		}
	}()

	go email.ValidateManyWithReport(emails, reportRecipient, reportID)

	validationRecord := createValidationRecord(nil, &logPath, r)
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
		UserID:                    middleware.GetUserFromRequest(r).ID,
		Origin:                    middleware.GetValidationOriginType(middleware.GetOriginFromRequest(r)),
		Type:                      models.BulkValidation,
		UploadFilename:            fn,
		RawBulkRequestLogFilepath: lp,
	}
}

func insertValidationRecord(v *models.Validation) error {
	err := validation.InsertNew(v)

	if err != nil {
		return err
	}

	return nil
}
