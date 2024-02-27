package handlers

import (
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/format"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

type ValidateEmailRequest struct {
	Email *string `json:"email"`
}

func ValidateEmailHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		req := ValidateEmailRequest{}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		if req.Email == nil {
			http.Error(w, "Missing email in payload", http.StatusBadRequest)
			return
		}

		resp, err := email.Validate(*req.Email)
		if err != nil {
			if errors.Is(err, format.ErrInvalidEmail) {
				http.Error(w, "Incorrect email format", http.StatusBadRequest)
				return
			}

			http.Error(w, "Internal Server Error", http.StatusBadRequest)
			return
		}

		err = file.SaveStringsToNewCSV([]string{*req.Email}, fmt.Sprintf("./%s", uuid.New().String()), GetIPsFromRequest(r), time.Now())
		if err != nil {
			log.Println("Failed to save request data:", err)
		}

		json.NewEncoder(w).Encode(resp)
	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
