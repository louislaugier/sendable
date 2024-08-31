package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/brevo"
	"email-validator/internal/pkg/contact_provider"
	"email-validator/internal/pkg/sendgrid"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

func SetProviderAPIKeyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	req := models.SetProviderAPIKeyRequest{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		handleError(w, err, "invalid payload", http.StatusInternalServerError)
		return
	}

	provider := req.Provider
	newAPIKey := req.APIKey
	if provider == "" || newAPIKey == "" {
		http.Error(w, "invalid payload: missing 'provider' and/or 'apiKey' fields in JSON body", http.StatusBadRequest)
		return
	}

	var totalContactsCount int

	switch provider {
	case models.BrevoContactProvider:
		client := brevo.NewClient(newAPIKey)

		_, count, err := brevo.GetContactsPaginated(client, 1, 0)
		if err != nil {
			http.Error(w, "Invalid API key", http.StatusUnauthorized)
			return
		}

		totalContactsCount = count
	case models.SendgridContactProvider:
		client := sendgrid.NewClient(newAPIKey)

		count, err := sendgrid.GetContactsCount(client)
		if err != nil {
			http.Error(w, "Invalid API key or insufficient permissions/scopes.", http.StatusUnauthorized)
			return
		}

		totalContactsCount = count
	default:
		http.Error(w, "unsupported provider", http.StatusBadRequest)
		return

	}

	userID := middleware.GetUserFromRequest(r).ID

	var existingProviderID *uuid.UUID
	for _, p := range middleware.GetContactProvidersFromContext(r) {
		if p.Type == provider {
			if *p.APIKey == newAPIKey {
				http.Error(w, "old and new API keys must not match", http.StatusBadRequest)
				return
			}

			existingProviderID = &p.ID
			break
		}
	}

	var err error
	if existingProviderID != nil {
		err = contact_provider.UpdateAPIKey(*existingProviderID, newAPIKey)
	} else {
		err = contact_provider.InsertNew(&models.ContactProvider{
			ID:                  uuid.New(),
			UserID:              userID,
			Type:                provider,
			APIKey:              &newAPIKey,
			LatestContactsCount: &totalContactsCount,
		})
	}
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"contactsCount": totalContactsCount,
	})
}
