package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/api_key"
	"sendable/internal/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func GenerateAPIKeyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	label := r.URL.Query().Get("label")
	if label == "" {
		http.Error(w, "Missing label query param", http.StatusBadRequest)
	}

	APIKey := uuid.New().String()

	encryptedKey := utils.Encrypt(APIKey)

	err := api_key.InsertNew(&models.APIKey{
		ID:        uuid.New(),
		Label:     label,
		LastChars: APIKey[len(APIKey)-5:],
		UserID:    middleware.GetUserFromRequest(r).ID,
		CreatedAt: time.Now(),
	}, &encryptedKey)
	if err != nil {
		log.Printf("Failed to insert API key: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	json.NewEncoder(w).Encode(map[string]string{
		"key": APIKey,
	})
}
