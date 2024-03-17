package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"encoding/json"
	"log"
	"net/http"
)

func GoogleAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.GoogleAuthRequest{}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	tokenInfo, err := oauth.VerifyGoogleClientID(r.Context(), body.Token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	log.Println(tokenInfo.Email)

	// Use tokenInfo to find or create a user in your database.

	// Issue a JWT

	// Return that information to the client as needed.
}
