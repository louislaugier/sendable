package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sendable/config"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"strconv"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	} else if body.Email == "" || body.Password == "" {
		http.Error(w, "Missing email & password pair in payload", http.StatusBadRequest)
		return
	}

	u, err := user.GetByEmailAndPasswordSHA256(body.Email, utils.Encrypt(body.Password))
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if u == nil {
		http.Error(w, "Invalid email address of password.", http.StatusUnauthorized)
		return
	}

	if !u.IsEmailConfirmed {
		err = config.EmailClient.SendEmail(models.ConfirmEmailAddressTemplate, "Activate your account", "Verify your email address", map[string]string{
			"email":                   u.Email,
			"email_confirmation_code": strconv.Itoa(*u.EmailConfirmationCode),
			"is_new_account":          "true",
			"domain":                  fmt.Sprintf("%s%s", config.BaseURL, config.APIVersionPrefix),
		}, body.Email)
		if err != nil {
			handleError(w, err, "Internal Server Error", http.StatusBadRequest)
			return
		}

		json.NewEncoder(w).Encode(models.UnconfirmedUser{
			ID:    u.ID,
			Email: u.Email,
		})

		return
	} else if u.Is2FAEnabled {
		json.NewEncoder(w).Encode(models.PreAuthUser{
			ID: u.ID,
		})

		return
	}

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}
