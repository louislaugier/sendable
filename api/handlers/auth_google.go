package handlers

import (
	"context"
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"net/http"
)

// can be used with a JWT or an access token (one-tap or standard auth)
func GoogleAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	body := models.GoogleAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.JWT == "" && body.AccessToken == "" {
		http.Error(w, "No token provided", http.StatusBadRequest)
		return
	}

	var email string
	var err error

	if body.JWT != "" {
		email, err = verifyGoogleJWT(body.JWT, r.Context())
	} else if body.AccessToken != "" {
		email, err = verifyGoogleAccessToken(body.AccessToken, r.Context())
	}

	if err != nil {
		handleError(w, err, "Authentication failed", http.StatusUnauthorized)
		return
	}

	processGoogleAuthenticatedUser(w, r, email)
}

func verifyGoogleJWT(jwt string, ctx context.Context) (string, error) {
	tokenInfo, err := oauth.VerifyGoogleJWT(ctx, jwt)
	if err != nil || tokenInfo == nil {
		return "", err
	}
	return tokenInfo.Email, nil
}

func verifyGoogleAccessToken(accessToken string, ctx context.Context) (string, error) {
	userInfo, err := oauth.VerifyGoogleAccessToken(ctx, accessToken)
	if err != nil || userInfo == nil {
		return "", err
	}
	return userInfo.Email, nil
}

func processGoogleAuthenticatedUser(w http.ResponseWriter, r *http.Request, email string) {
	gp := models.GoogleProvider

	u, err := user.GetByEmailAndProvider(email, gp)
	if err != nil {
		handleError(w, err, "Error processing user", http.StatusInternalServerError)
		return
	}

	if u == nil {
		createConfirmedAccountAndAndBindJWT(w, r, email, &gp)
		return
	}

	json.NewEncoder(w).Encode(u)
}
