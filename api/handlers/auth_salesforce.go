package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/salesforce"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// salesforceAuthHandler handles authentication with Salesforce.
func salesforceAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	body, err := decodeSalesforceAuthRequestBody(r)
	if err != nil {
		handleError(w, err, "Error decoding request body", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifySalesforceCode(body.Code, body.CodeVerifier)
	if err != nil {
		handleError(w, err, "Invalid code & code_verifier", http.StatusUnauthorized)
		return
	}

	user, err := processSalesforceUser(userInfo, accessToken, r)
	if err != nil {
		handleError(w, err, "Error processing user", http.StatusInternalServerError)
		return
	}

	if err := middleware.GenerateAndBindJWT(user); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// decodeSalesforceAuthRequestBody decodes the JSON request body.
func decodeSalesforceAuthRequestBody(r *http.Request) (*models.SalesforceAuthRequest, error) {
	var body models.SalesforceAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		return nil, fmt.Errorf("error decoding JSON")
	}
	if body.Code == "" || body.CodeVerifier == "" {
		return nil, fmt.Errorf("missing code & code_verifier pair")
	}
	return &body, nil
}

// processSalesforceUser processes or creates a user based on the Salesforce response.
func processSalesforceUser(userInfo *models.SalesforceUser, accessToken string, r *http.Request) (*models.User, error) {
	u, err := user.GetByEmailAndProvider(userInfo.Email, models.SalesforceProvider)
	if err != nil {
		return nil, err
	}
	if u == nil {
		u, err = createConfirmedUserFromSalesforceAuth(userInfo, r)
		if err != nil {
			return nil, err
		}
	}

	go func() {
		if err := fetchAndSaveSalesforceContacts(accessToken, r); err != nil {
			log.Printf("Failed to fetch and save Salesforce contacts: %v", err)
		}
	}()

	return u, nil
}

// fetchAndSaveContacts fetches and saves Salesforce contacts to a CSV file.
func fetchAndSaveSalesforceContacts(accessToken string, r *http.Request) error {
	contacts, err := salesforce.FetchContacts(accessToken)
	if err != nil {
		return err
	}

	emails := make([]string, len(contacts))
	for _, c := range contacts {
		emails = append(emails, c.Email)
	}

	if err := file.SaveStringsToNewCSV(emails, fmt.Sprintf("./uploads/oauth_contacts/%s/user-%s.csv", models.SalesforceProvider, middleware.GetUserFromRequest(r).ID), utils.GetIPsFromRequest(r), time.Now()); err != nil {
		return err
	}
	return nil
}

func createConfirmedUserFromSalesforceAuth(userInfo *models.SalesforceUser, r *http.Request) (*models.User, error) {
	s := models.SalesforceProvider
	u := &models.User{
		ID:               uuid.New(),
		Email:            userInfo.Email,
		IsEmailConfirmed: true,
		LastIPAddresses:  utils.GetIPsFromRequest(r),
		LastUserAgent:    r.UserAgent(),
		AuthProvider:     &s,
	}
	if err := user.InsertNew(u, nil); err != nil {
		return nil, err
	}
	return u, nil
}
