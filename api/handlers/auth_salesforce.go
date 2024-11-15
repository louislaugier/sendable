package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/file"
	"sendable/internal/pkg/oauth"
	"sendable/internal/pkg/salesforce"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// SalesforceAuthHandler handles authentication with Salesforce.
func SalesforceAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := decodeSalesforceAuthRequestBody(r)
	if err != nil {
		handleError(w, err, "Error decoding request body", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifySalesforceCode(body.Code, body.CodeVerifier)
	if err != nil {
		handleError(w, err, "Invalid code & codeVerifier", http.StatusUnauthorized)
		return
	}

	user, err := processSalesforceUser(userInfo, accessToken, r)
	if err != nil {
		handleError(w, err, "Error processing user", http.StatusInternalServerError)
		return
	}

	if user.Is2FAEnabled {
		json.NewEncoder(w).Encode(models.PreAuthUser{
			ID: user.ID,
		})

		return
	}

	if err := middleware.GenerateAndBindJWT(user); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// decodeSalesforceAuthRequestBody decodes the JSON request body.
func decodeSalesforceAuthRequestBody(r *http.Request) (*models.AuthSalesforceRequest, error) {
	var body models.AuthSalesforceRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		return nil, fmt.Errorf("error decoding JSON")
	}
	if body.Code == "" || body.CodeVerifier == "" {
		return nil, fmt.Errorf("missing code & codeVerifier pair")
	}
	return &body, nil
}

// processSalesforceUser processes or creates a user based on the Salesforce response.
func processSalesforceUser(userInfo *models.SalesforceUser, accessToken string, r *http.Request) (*models.User, error) {
	u, err := user.GetByEmailAndProvider(userInfo.Email, models.SalesforceProvider)
	if err != nil {
		if err.Error() == models.ErrEmailAlreadyTaken {
			existingUser, err := user.GetByEmail(userInfo.Email)
			if err != nil {
				return nil, err
			}
			if existingUser == nil {
				return nil, errors.New("internal server error")
			}
			message := "user already exists with email and password auth"
			if existingUser.AuthProvider != nil {
				message = fmt.Sprintf("user already exists with provider %s", cases.Title(language.Und).String(string(*existingUser.AuthProvider)))
			}
			return nil, errors.New(message)
		}
		return nil, err
	}

	if u == nil {
		u, err = createConfirmedUserFromSalesforceAuth(userInfo, r)
		if err != nil {
			return nil, err
		}

		go func() {
			if err := fetchAndSaveSalesforceContacts(accessToken, r); err != nil {
				log.Printf("Failed to fetch and save Salesforce contacts: %v", err)
			}
		}()
	}

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

	if err := file.SaveStringsToNewCSV(emails, fmt.Sprintf("./files/oauth_contacts/%s/user-%s.csv", models.SalesforceProvider, middleware.GetUserFromRequest(r).ID), utils.GetIPsFromRequest(r), time.Now()); err != nil {
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
