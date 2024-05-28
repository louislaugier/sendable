package handlers

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"fmt"
	"net/http"
)

func ConfirmEmailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	body := models.ConfirmEmail{}
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
	} else if u.EmailConfirmationCode != &body.EmailConfirmationCode {
		handleError(w, err, "Invalid email confirmation code", http.StatusBadRequest)
		return
	}

	err = user.SetEmailConfirmed(u.ID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("%s/dashboard?email_confirmed=true", config.FrontendURL), http.StatusSeeOther)
}
