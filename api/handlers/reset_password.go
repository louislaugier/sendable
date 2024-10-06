package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sendable/config"
	"sendable/internal/models"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"strconv"
)

func ResetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.ResetPasswordRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.Email == "" {
		err := errors.New("missing email in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	u, err := user.GetByEmail(body.Email)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	} else if u == nil {
		handleError(w, err, "User not found.", http.StatusNotFound)
		return
	} else if u.AuthProvider != nil {
		err := fmt.Errorf("account was created with %s, cannot set a password.", *u.AuthProvider)
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	emailConfirmationCode, err := utils.GenerateRandomSixDigitCode()
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	err = user.SetEmailConfirmationCode(u.ID, *emailConfirmationCode)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	err = config.EmailClient.SendEmail(models.ResetPasswordTemplate, "Password reset", "Reset your account's password", map[string]string{
		"email_confirmation_code": strconv.Itoa(*emailConfirmationCode),
		"domain":                  fmt.Sprintf("%s%s", config.BaseURL, config.APIVersionPrefix),
	}, body.Email)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
