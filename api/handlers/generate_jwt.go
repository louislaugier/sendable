package handlers

import (
	"email-validator/handlers/middleware"
	"encoding/json"
	"log"
	"net/http"
)

func GenerateJWTHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	user := middleware.GetUserFromRequest(r)

	jwt, err := middleware.GenerateJWT(user.ID, user.Email)
	if err != nil || jwt == nil {
		log.Printf("Error generating JWT: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"jwt": *jwt,
	})
}
