package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/validation"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/google/uuid"
)

// insert single validation in db with origin (consumer app or api)
func validateEmailHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		req := models.ValidateEmailRequest{}

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

		v := &models.Validation{
			ID:                uuid.New(),
			UserID:            middleware.GetUserIDFromRequest(r),
			SingleTargetEmail: *req.Email,
			Origin:            middleware.GetOriginFromRequest(r),
			Type:              models.SingleValidation,
		}
		if err := validation.InsertNew(v); err != nil {
			handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		}

		json.NewEncoder(w).Encode(resp)
	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
