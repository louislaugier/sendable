package handlers

import (
	"email-validator/internal/pkg/file"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

type ValidateEmailsRequest struct {
	Emails []string `json:"emails,omitempty"`
	// file
}

func ValidateEmailsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		// get userID from JWT

		req := ValidateEmailsRequest{}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		if len(req.Emails) == 0 { // or no file
			http.Error(w, "Missing emails in payload", http.StatusBadRequest)
			return
		}

		// var report []models.ReacherResponse

		// if file
		// get file extension
		// resp, err := email.ValidateManyFromFile(reader, fileExt)
		// if err != nil {
		// 	if errors.Is(err, email.ErrNoEmailsToValidate) {
		// 		http.Error(w, "No email addreses present in file", http.StatusBadRequest)
		// 		return
		// 	} else if errors.Is(err, format.ErrInvalidFileExt) {
		// 		file.SaveFile(file, fmt.Sprintf("./%s", uuid.New().String()))

		// 		http.Error(w, "Unauthorized file type", http.StatusBadRequest)
		// 		return
		// 	}

		// 	http.Error(w, "Internal Server Error", http.StatusBadRequest)
		// 	return
		// }
		// report = append(report, resp...)

		// if payload emails slice
		// if len(req.Emails) > 0 {
		// 	resp, err := email.ValidateManyFromSlice(reader, fileExt)

		// 	if err != nil {
		// 		if errors.Is(err, email.ErrNoEmailsToValidate) {
		// 			http.Error(w, "No email addreses present in file", http.StatusBadRequest)
		// 			return
		// 		}

		// 		http.Error(w, "Internal Server Error", http.StatusBadRequest)
		// 		return
		// 	}

		// 	report = append(report, resp...)
		// }

		// if no file
		err := file.SaveStringsToNewCSV(req.Emails, fmt.Sprintf("./%s", uuid.New().String()), GetIPsFromRequest(r), time.Now())
		if err != nil {
			log.Println("Failed to save request data:", err)
		}
		// else
		// file.SaveFile(file, fmt.Sprintf("./%s", uuid.New().String()))

		// json.NewEncoder(w).Encode(resp)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
