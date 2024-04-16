package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/file"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strings"
)

// insert validation batch in db with origin (consumer app or api)
// Payload: either multipart file (field name "file") or JSON body
func validateEmailsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		uploadedFile, uploadedFileHeader, err := r.FormFile("file")

		reqHasFile := err == nil && uploadedFileHeader != nil
		if err != nil && err != http.ErrMissingFile {
			log.Printf("Failed to parse request file: %v", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		defer uploadedFile.Close()

		tokenClaims, err := middleware.ParseClaimsFromJWT(middleware.ExtractToken(r))
		if err != nil {
			log.Printf("Failed to parse request token claims: %v", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		reportRecipient := tokenClaims.UserEmail

		if reqHasFile {
			// go file.SaveMultipart(uploadedFileHeader, fmt.Sprintf("./uploads/%s", uploadedFileHeader.Filename))
			err = file.SaveMultipart(uploadedFileHeader, fmt.Sprintf("./uploads/%s", uploadedFileHeader.Filename))
			if err != nil {
				log.Printf("Failed to save request file: %v", err)
			}

			fileExtension := models.FileExtension(strings.ToLower(strings.TrimPrefix(filepath.Ext(uploadedFileHeader.Filename), ".")))

			if !fileExtension.IsAllowed() {
				http.Error(w, fmt.Sprintf("invalid payload: %v", models.ErrInvalidFileExt.Error()), http.StatusBadRequest)
				return
			}

			go email.ValidateManyFromFileWithReport(uploadedFile, uploadedFileHeader, fileExtension, reportRecipient)

			fmt.Fprint(w, http.StatusText(http.StatusOK))
			return
		}

		req, err := email.ValidateValidationRequest(w, r)
		if err != nil {
			return
		}

		// go file.SaveStringsToNewCSV(req.Emails, fmt.Sprintf("./uploads/%s.csv", uuid.New().String()), utils.GetIPsFromRequest(r), time.Now())
		// err = file.SaveStringsToNewCSV(req.Emails, fmt.Sprintf("./uploads/%s.csv", uuid.New().String()), utils.GetIPsFromRequest(r), time.Now())
		// if err != nil {
		// 	log.Printf("Failed to save request data: %v", err)
		// }

		go email.ValidateManyWithReport(req.Emails, reportRecipient)

		fmt.Fprint(w, http.StatusText(http.StatusOK))
	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
