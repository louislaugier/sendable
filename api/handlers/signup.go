package handlers

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/google/uuid"
)

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body models.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	} else if body.Email == "" || body.Password == "" {
		http.Error(w, "Missing email & password pair in payload", http.StatusBadRequest)
		return
	}

	pwd := utils.Encrypt(body.Password)
	confirmationCode, err := utils.GenerateRandomSixDigitCode()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	u := &models.User{
		ID:                    uuid.New(),
		Email:                 body.Email,
		EmailConfirmationCode: confirmationCode,
		LastIPAddresses:       utils.GetIPsFromRequest(r),
		LastUserAgent:         r.UserAgent(),
	}
	if err := user.InsertNew(u, &pwd); err != nil {
		if err.Error() == models.ErrEmailAlreadyTaken {
			http.Error(w, "Email address already in use", http.StatusConflict)
			return
		}

		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = config.EmailClient.SendEmail(models.ConfirmEmailAddressTemplate, "Activate your account", "Verify your email address", map[string]string{
		"email_confirmation_code": strconv.Itoa(*confirmationCode),
		"is_new_account":          "true",
		"domain":                  fmt.Sprintf("%s%s", config.DomainURL, config.APIVersionPrefix),
	}, body.Email)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(u)
}
