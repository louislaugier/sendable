package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

func createConfirmedAccountAndAndBindJWT(w http.ResponseWriter, r *http.Request, email string, provider *models.AuthProvider) {
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

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating and binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}
