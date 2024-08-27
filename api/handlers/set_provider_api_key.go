package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/brevo"
	"email-validator/internal/pkg/sendgrid"
	"encoding/json"
	"log"
	"net/http"
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
	if provider == nil || req.APIKey == "" {
		http.Error(w, "invalid payload: missing 'provider' and/or 'apiKey' fields in JSON body", http.StatusBadRequest)
		return
	}

	var totalCount int

	switch *provider {
	case models.BrevoContactProvider:
		client := brevo.NewClient(req.APIKey)

		_, count, err := brevo.GetContactsPaginated(client, 1, 0, nil, nil)
		if err != nil {
			http.Error(w, "invalid Brevo API key", http.StatusUnauthorized)
			log.Println(err)
			return
		}

		totalCount = count
	case models.SendgridContactProvider:
		client := sendgrid.NewClient(req.APIKey)

		// go func() {
		// 	_, err := sendgrid.GetContacts(client, nil, nil)
		// 	log.Println(err)
		// }()
		// totalCount = int64(0)

		count, err := sendgrid.GetContactsCount(client)
		if err != nil {
			log.Println(err)
			http.Error(w, "invalid SendGrid API key or insufficient permissions/scopes", http.StatusUnauthorized)
			return
		}

		totalCount = count
	default:
		http.Error(w, "unsupported provider", http.StatusBadRequest)
		return

	}

	// insert/update contact_provider in DB

	json.NewEncoder(w).Encode(map[string]interface{}{
		"contactsCount": totalCount,
	})
}
