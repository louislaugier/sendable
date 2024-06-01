package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
)

// We can get Zoho organization info via oauth but no info on the user logging in, therefore we need to ask the user who he is in a given organization after the oauth flow and then send him a confirmation email
func ZohoAuthSetEmailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	body := models.AuthZohoSetEmailRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	user := middleware.GetUserFromRequest(r)
	if user.EmailConfirmationCode == nil {
		handleError(w, errors.New("no email confirmation code found"), "Internal Server Error", http.StatusBadRequest)
		return
	}

	go config.EmailClient.SendEmail(models.ConfirmEmailAddressTemplate, "Email address confirmation", "Verify your email address", map[string]string{
		"email_confirmation_code": strconv.Itoa(*user.EmailConfirmationCode),
		"is_new_account":          "false",
		"domain":                  fmt.Sprintf("%s%s", config.DomainURL, config.APIVersionPrefix),
	}, body.Email)

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
