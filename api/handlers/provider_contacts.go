package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/brevo"
	"sendable/internal/pkg/hubspot"
	"sendable/internal/pkg/mailchimp"
	"sendable/internal/pkg/oauth"
	"sendable/internal/pkg/salesforce"
	"sendable/internal/pkg/sendgrid"
	"sendable/internal/pkg/zoho"
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

	providers := middleware.GetContactProvidersFromContext(r)
	var (
		existingBrevoProvider    *models.ContactProvider
		existingSendgridProvider *models.ContactProvider
	)
	for _, p := range providers {
		if p.Type == models.BrevoContactProvider {
			existingBrevoProvider = &p
		} else if p.Type == models.SendgridContactProvider {
			existingSendgridProvider = &p
		}
	}

	contacts := []string{}

	if provider == string(models.BrevoContactProvider) {
		if existingBrevoProvider == nil || existingBrevoProvider.APIKey == nil {
			err := "no brevo provider attached to account"
			handleError(w, errors.New(err), err, http.StatusBadRequest)
			return
		}

		client := brevo.NewClient(*existingBrevoProvider.APIKey)

		c, err := brevo.GetContacts(client)
		if err != nil {
			http.Error(w, "invalid Brevo API key or insufficient permissions/scopes", http.StatusUnauthorized)
			return
		}

		for _, contact := range c {
			contacts = append(contacts, contact.Email)
		}
	} else if provider == string(models.SendgridContactProvider) {
		if existingSendgridProvider == nil || existingSendgridProvider.APIKey == nil {
			err := "no brevo provider attached to account"
			handleError(w, errors.New(err), err, http.StatusBadRequest)
			return
		}

		client := sendgrid.NewClient(*existingSendgridProvider.APIKey)

		c, err := sendgrid.GetContacts(client)
		if err != nil {
			http.Error(w, "invalid Sendgrid API key or insufficient permissions/scopes", http.StatusUnauthorized)
			return
		}

		for _, contact := range c {
			contacts = append(contacts, contact.Email)
		}
	} else {
		code := r.URL.Query().Get("code")
		if code == "" {
			err := "missing code query param"
			handleError(w, errors.New(err), err, http.StatusBadRequest)
			return
		}

		switch provider {
		case string(models.SalesforceProvider):
			codeVerifier := r.URL.Query().Get("codeVerifier")
			if codeVerifier == "" {
				err := "missing codeVerifier query param"
				handleError(w, errors.New(err), err, http.StatusBadRequest)
				return
			}

			accessToken, _, err := oauth.VerifySalesforceCode(code, codeVerifier)
			if err != nil {
				handleError(w, err, "Invalid code & codeVerifier", http.StatusUnauthorized)
				return
			}

			c, err := salesforce.FetchContacts(accessToken)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}

			for _, contact := range c {
				contacts = append(contacts, contact.Email)
			}
		case string(models.ZohoProvider):
			accessToken, _, err := oauth.VerifyZohoCode(code)
			if err != nil {
				handleError(w, err, "Invalid code", http.StatusUnauthorized)
				return
			}

			c, err := zoho.GetContacts(accessToken)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			l, err := zoho.GetLeads(accessToken)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			v, err := zoho.GetVendors(accessToken)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			for _, contact := range c {
				contacts = append(contacts, contact.Email)
			}
			for _, lead := range l {
				contacts = append(contacts, lead.Email)
			}
			for _, vendor := range v {
				contacts = append(contacts, vendor.Email)
			}
		case string(models.HubspotProvider):
			accessToken, _, err := oauth.VerifyHubspotCode(code)
			if err != nil {
				handleError(w, err, "Invalid code", http.StatusUnauthorized)
				return
			}

			c, err := hubspot.GetContacts(accessToken)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}

			for _, contact := range c {
				contacts = append(contacts, contact.Properties.Email)
			}
		case string(models.MailchimpProvider):
			accessToken, mailChimpUser, err := oauth.VerifyMailchimpCode(code)
			if err != nil {
				handleError(w, err, "Invalid code", http.StatusUnauthorized)
				return
			}

			c, err := mailchimp.GetContacts(accessToken, &mailChimpUser.APIEndpoint)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			for _, contact := range c {
				contacts = append(contacts, contact.Email)
			}
		default:
			err := "unknown provider"
			handleError(w, errors.New(err), err, http.StatusBadRequest)
			return
		}

	}

	json.NewEncoder(w).Encode(contacts)
}
