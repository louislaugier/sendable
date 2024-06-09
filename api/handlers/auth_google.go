package handlers

import (
	"context"
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

// can be used with a JWT or an access token (one-tap or standard auth)
func GoogleAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.AuthGoogleRequest{}

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
		createConfirmedAccount(w, r, email, &gp)
		return
	}

	if u.Is2FAEnabled {
		json.NewEncoder(w).Encode(models.PreAuthUser{
			ID:           u.ID,
			Is2FAEnabled: true,
		})

		return
	}

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}

func createConfirmedAccount(w http.ResponseWriter, r *http.Request, email string, provider *models.AuthProvider) {
	u := &models.User{
		ID:               uuid.New(),
		Email:            email,
		IsEmailConfirmed: true,
		LastIPAddresses:  utils.GetIPsFromRequest(r),
		LastUserAgent:    r.UserAgent(),
		AuthProvider:     provider,
	}

	if err := user.InsertNew(u, nil); err != nil {
		handleError(w, err, "Error inserting new user", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}
