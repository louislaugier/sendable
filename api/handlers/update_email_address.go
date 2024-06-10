package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
)

func UpdateEmailAddressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.UpdateEmailAddressRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.Email == "" {
		err := errors.New("missing email in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	u := middleware.GetUserFromRequest(r)
	if u.AuthProvider != nil {
		err := errors.New("account has an authentication provider, cannot update email address")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	if body.Email == u.Email {
		err := errors.New("new email address must be different from current")
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

	err = config.EmailClient.SendEmail(models.ConfirmEmailAddressTemplate, "New email address confirmation", "Verify your new email address", map[string]string{
		"email_confirmation_code": strconv.Itoa(*emailConfirmationCode),
		"is_new_account":          "false",
		"domain":                  fmt.Sprintf("%s%s", config.DomainURL, config.APIVersionPrefix),
	}, body.Email)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
