package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"fmt"
	"net/http"
)

// ConfirmEmailAddressHandler is called directly from transactional emails
func ConfirmEmailAddressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.ConfirmEmailAddressRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	u, err := user.GetByEmailAndConfirmationCode(body.Email, body.EmailConfirmationCode)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if u == nil {
		handleError(w, err, "User not found", http.StatusNotFound)
		return
	} else if *u.EmailConfirmationCode != body.EmailConfirmationCode {
		handleError(w, err, "Invalid email confirmation code", http.StatusUnauthorized)
		return
	}

	if body.IsNewAccount {
		err = user.SetEmailConfirmed(u.ID)
		if err != nil {
			handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	} else {
		err = user.UpdateEmailAddress(u.ID, u.Email)
		if err != nil {
			handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	page := "dashboard"
	if !body.IsNewAccount && !body.IsZohoConfirmation {
		page = "settings"
	}

	if r.URL.Query().Get("magicLink") != "" {
		http.Redirect(w, r, fmt.Sprintf("%s/%s?email_confirmed=true", config.FrontendURL, page), http.StatusSeeOther)
		return
	}

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}
