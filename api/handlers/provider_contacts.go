package handlers

import (
	"email-validator/internal/models"
	"encoding/json"
	"errors"
	"net/http"
)

func ProviderContactsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	provider := r.URL.Query().Get("provider")
	if provider == "" {
		err := "missing provider query param"
		handleError(w, errors.New(err), err, http.StatusBadRequest)
		return
	}

	// userID := middleware.GetUserFromRequest(r).ID

	contacts := []string{}

	if provider == string(models.BrevoContactProvider) {
		// modifiedSince, createdSince := r.URL.Query().Get("modifiedSince"), r.URL.Query().Get("createdSince")

		// check if user has brevo api key in DB
		// get contacts
	} else if provider == string(models.SendgridContactProvider) {
		// check if user has sendgrid api key in DB
		// get contacts
	} else {
		// check if has code query param
		switch provider {
		case string(models.SalesforceProvider):
		// get access token from code & get contacts from access token
		case string(models.ZohoProvider):
		// get access token from code & get contacts from access token
		case string(models.HubspotProvider):
		// get access token from code & get contacts from access token
		default:
			err := "unknown provider"
			handleError(w, errors.New(err), err, http.StatusBadRequest)
		}

	}

	json.NewEncoder(w).Encode(contacts)
}
