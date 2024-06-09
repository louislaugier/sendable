package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	two_factor_auth "email-validator/internal/pkg/2fa"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

func Enable2FAHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.Enable2FARequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.TwoFactorAuthenticationCode == "" || body.TwoFactorAuthenticationSecret == "" {
		err := errors.New("missing twoFactorAuthenticationCode & twoFactorAuthenticationSecret pair in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	u := middleware.GetUserFromRequest(r)

	ok := two_factor_auth.Verify2FA(body.TwoFactorAuthenticationCode, body.TwoFactorAuthenticationSecret)
	if !ok {
		err := errors.New("wrong 2FA code & secret pair")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	err := user.Set2FASecret(u.ID, &body.TwoFactorAuthenticationSecret)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
