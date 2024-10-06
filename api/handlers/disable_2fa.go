package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	two_factor_auth "sendable/internal/pkg/2fa"
	"sendable/internal/pkg/user"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

func Disable2FAHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.Disable2FARequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.TwoFactorAuthenticationCode == nil {
		err := errors.New("missing twoFactorAuthenticationCode in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	u := middleware.GetUserFromRequest(r)

	ok := two_factor_auth.Verify2FA(*body.TwoFactorAuthenticationCode, *u.TwoFactorAuthSecret)
	if !ok {
		err := errors.New("wrong 2FA code")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	err := user.Disable2FA(u.ID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
