package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/format"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
)

type ValidateEmailsRequest struct {
	Emails []string `json:"emails,omitempty"`
}

// Either multipart file (field name "file") or json payload
// Invalid format emails not included in response
func ValidateEmailsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		req := ValidateEmailsRequest{}

		err := r.ParseMultipartForm(100 << 20) // 100 MB maximum
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Error parsing form: %v", err)
			return
		}

		uploadedFile, uploadedFileHeader, err := r.FormFile("file")

		reqHasFile := err == nil && err != http.ErrMissingFile
		if err != nil && err != http.ErrMissingFile {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer uploadedFile.Close()

		var report []models.ReacherResponse

		if reqHasFile {
			fileExtension := strings.ToLower(strings.TrimPrefix(uploadedFileHeader.Filename, "."))

			resp, err := email.ValidateManyFromFile(uploadedFile, uploadedFileHeader, fileExtension)
			if err != nil {
				if errors.Is(err, email.ErrNoEmailsToValidate) {
					http.Error(w, "No email addreses present in file", http.StatusBadRequest)
					return
				} else if errors.Is(err, format.ErrInvalidFileExt) {
					file.SaveFile(uploadedFileHeader, fmt.Sprintf("./%s", uploadedFileHeader.Filename))

					http.Error(w, "Unauthorized file type", http.StatusBadRequest)
					return
				}

				log.Println(err)
				http.Error(w, "Internal Server Error", http.StatusBadRequest)
				return
			}
			report = append(report, resp...)

			err = file.SaveFile(uploadedFileHeader, fmt.Sprintf("./%s", uploadedFileHeader.Filename))
			if err != nil {
				log.Println("Failed to save request data:", err)
			}

			json.NewEncoder(w).Encode(report)
			return
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		resp, err := email.ValidateMany(req.Emails)

		if err != nil {
			if errors.Is(err, email.ErrNoEmailsToValidate) {
				http.Error(w, "No email addreses present in array", http.StatusBadRequest)
				return
			}

			log.Println(err)
			http.Error(w, "Internal Server Error", http.StatusBadRequest)
			return
		}

		report = append(report, resp...)

		err = file.SaveStringsToNewCSV(req.Emails, fmt.Sprintf("./uploads/%s.csv", uuid.New().String()), GetIPsFromRequest(r), time.Now())
		if err != nil {
			log.Println("Failed to save request data:", err)
		}

		json.NewEncoder(w).Encode(report)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
