package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/oauth"
	"sendable/internal/pkg/user"
	"encoding/json"
	"log"
	"net/http"
)

func LinkedinAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.AuthLinkedinRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("linkedinAuthHandler: Error decoding JSON: %v", err)
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.Code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifyLinkedinCode(body.Code)
	if err != nil || accessToken == "" || userInfo == nil {
		if err != nil {
			log.Printf("Error verifying Linkedin code: %v", err)
		}
		http.Error(w, "Invalid code", http.StatusUnauthorized)
		return
	}

	email := userInfo.Email

	processLinkedinAuthenticatedUser(w, r, email)
}

func processLinkedinAuthenticatedUser(w http.ResponseWriter, r *http.Request, email string) {
	lp := models.LinkedinProvider

	u, err := user.GetByEmailAndProvider(email, lp)
	if err != nil {
		handleError(w, err, "Error processing user", http.StatusInternalServerError)
		return
	}

	if u == nil {
		createConfirmedAccount(w, r, email, &lp)
		return
	}

	if u.Is2FAEnabled {
		json.NewEncoder(w).Encode(models.PreAuthUser{
			ID: u.ID,
		})

		return
	}

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}
