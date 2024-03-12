package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/file"
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
			log.Printf("Failed to decode request payload: %v", err)
			http.Error(w, "invalid payload", http.StatusBadRequest)
			return
		}

		if req.Email == nil {
			http.Error(w, "invalid payload: missing email field in JSON body", http.StatusBadRequest)
			return
		}

		resp, err := email.Validate(*req.Email)
		if err != nil {
			if errors.Is(err, models.ErrInvalidEmail) {
				http.Error(w, models.ErrInvalidEmail.Error(), http.StatusBadRequest)
				return
			}

			log.Println(err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		err = file.SaveStringsToNewCSV([]string{*req.Email}, fmt.Sprintf("./uploads/%s.csv", uuid.New().String()), middleware.GetIPsFromRequest(r), time.Now())
		if err != nil {
			log.Printf("Failed to save request data: %v", err)
		}

		json.NewEncoder(w).Encode(resp)
	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
