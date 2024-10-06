package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	two_factor_auth "sendable/internal/pkg/2fa"
	"sendable/internal/pkg/user"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/google/uuid"
)

func Auth2FAHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.Auth2FARequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.UserID == uuid.Nil || body.TwoFactorAuthenticationCode == nil {
		err := errors.New("missing userId & twoFactorAuthenticationCode pair in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := user.GetByID(body.UserID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if user == nil {
		err := errors.New("user not found")
		handleError(w, err, err.Error(), http.StatusNotFound)
		return
	}

	ok := two_factor_auth.Verify2FA(*body.TwoFactorAuthenticationCode, *user.TwoFactorAuthSecret)
	if !ok {
		err := errors.New("wrong userId & twoFactorAuthenticationCode pair")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	if err := middleware.GenerateAndBindJWT(user); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}
