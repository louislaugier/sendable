package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/hubspot"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

func hubspotAuthHandler(w http.ResponseWriter, r *http.Request) {
	body, err := decodeHubspotAuthRequestBody(r)
	if err != nil {
		handleError(w, err, "Error decoding request body", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifyHubspotCode(body.Code)
	if err != nil {
		handleError(w, fmt.Errorf("invalid HubSpot code: %v", err), "Invalid code", http.StatusUnauthorized)
		return
	}

	user, err := processHubspotUser(userInfo, accessToken, r)
	if err != nil {
		handleError(w, err, "Error processing user", http.StatusInternalServerError)
		return
	}

	if err := middleware.GenerateAndBindJWT(user); err != nil {
		handleError(w, fmt.Errorf("error generating & binding JWT to user %s: %v", userInfo.Email, err), "Internal Server Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func decodeHubspotAuthRequestBody(r *http.Request) (models.HubspotAuthRequest, error) {
	var body models.HubspotAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		return body, fmt.Errorf("error decoding JSON")
	}
	if body.Code == "" {
		return body, fmt.Errorf("missing code in body")
	}
	return body, nil
}

func processHubspotUser(userInfo *models.HubspotUser, accessToken string, r *http.Request) (*models.User, error) {
	u, err := user.GetByEmailAndProvider(userInfo.Email, models.HubspotProvider)
	if err != nil {
		log.Printf("Error fetching user with email %s: %v", userInfo.Email, err)
		return nil, fmt.Errorf("internal Server Error")
	}

	if u == nil {
		u, err = createConfirmedUserFromHubspotAuth(userInfo, r)
		if err != nil {
			return nil, err
		}
	}

	go func() {
		if err := fetchAndSaveHubspotContacts(accessToken, r); err != nil {
			log.Printf("Failed to fetch and save HubSpot contacts: %v", err)
		}
	}()

	return u, nil
}

func createConfirmedUserFromHubspotAuth(userInfo *models.HubspotUser, r *http.Request) (*models.User, error) {
	hubspotProvider := models.HubspotProvider
	u := &models.User{
		ID:               uuid.New(),
		Email:            userInfo.Email,
		IsEmailConfirmed: true,
		LastIPAddresses:  utils.GetIPsFromRequest(r),
		LastUserAgent:    r.UserAgent(),
		AuthProvider:     &hubspotProvider,
	}

	if err := user.InsertNew(u, nil); err != nil {
		log.Printf("Error inserting new user with email %s: %v", userInfo.Email, err)
		return nil, fmt.Errorf("internal Server Error")
	}
	return u, nil
}

func fetchAndSaveHubspotContacts(accessToken string, r *http.Request) error {
	contacts, err := hubspot.GetContacts(accessToken)
	if err != nil {
		log.Printf("Error fetching HubSpot contacts: %v", err)
		return err
	}

	emails := []string{}
	for _, c := range contacts {
		emails = append(emails, c.Properties.Email)
	}

	if err := file.SaveStringsToNewCSV(emails, fmt.Sprintf("./uploads/oauth_contacts/%s/user-%s.csv", models.HubspotProvider, middleware.GetUserIDFromRequest(r)), utils.GetIPsFromRequest(r), time.Now()); err != nil {
		log.Printf("Failed to save HubSpot contacts from request data: %v", err)
		return err
	}
	return nil
}
