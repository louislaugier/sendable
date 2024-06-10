package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	} else if body.Email == "" || body.Password == "" {
		http.Error(w, "Missing email & password pair in payload", http.StatusBadRequest)
		return
	}

	u, err := user.GetByEmailAndPasswordSHA256(body.Email, utils.Encrypt(body.Password))
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if u == nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
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
