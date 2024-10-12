package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sendable/internal/models"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
)

// TODO: rename to reset_password_update everywhere
func SetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.SetPasswordRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.EmailConfirmationCode == nil || body.Password == "" {
		err := errors.New("missing email, emailConfirmationCode and/or password in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	ok, err := utils.IsValidPassword(body.Password)
	if !ok || err != nil {
		http.Error(w, fmt.Sprintf("Invalid password: %s", err.Error()), http.StatusBadRequest)
		return
	}

	u, err := user.GetByEmailAndConfirmationCode(body.Email, *body.EmailConfirmationCode)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if u == nil {
		handleError(w, err, "Invalid code.", http.StatusUnauthorized)
		return
	} else if u.AuthProvider != nil {
		err := fmt.Errorf("account was created with %s, cannot set a password", *u.AuthProvider)
		handleError(w, err, err.Error(), http.StatusUnauthorized)
		return
	}

	err = user.UpdatePasswordSHA256(u.ID, utils.Encrypt(body.Password))
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
