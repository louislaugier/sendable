package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/file"
	"sendable/internal/pkg/hubspot"
	"sendable/internal/pkg/oauth"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"time"

	"github.com/google/uuid"
)

func HubspotAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

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

func decodeHubspotAuthRequestBody(r *http.Request) (models.AuthHubspotRequest, error) {
	var body models.AuthHubspotRequest
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
		return nil, err
	}

	if u == nil {
		u, err = createConfirmedUserFromHubspotAuth(userInfo, r)
		if err != nil {
			return nil, err
		}

		go func() {
			if err := fetchAndSaveHubspotContacts(accessToken, r, u); err != nil {
				log.Printf("Failed to fetch and save HubSpot contacts: %v", err)
			}
		}()
	}

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
		CurrentPlan:      *models.EmptyFreePlan(),
	}

	if err := user.InsertNew(u, nil); err != nil {
		log.Printf("Error inserting new user with email %s: %v", userInfo.Email, err)
		return nil, fmt.Errorf("internal Server Error")
	}

	return u, nil
}

func fetchAndSaveHubspotContacts(accessToken string, r *http.Request, u *models.User) error {
	contacts, err := hubspot.GetContacts(accessToken)
	if err != nil {
		log.Printf("Error fetching HubSpot contacts: %v", err)
		return err
	}

	emails := []string{}
	for _, c := range contacts {
		emails = append(emails, c.Properties.Email)
	}

	if err := file.SaveStringsToNewCSV(emails, fmt.Sprintf("./files/oauth_contacts/%s/user-%s.csv", models.HubspotProvider, u.ID), utils.GetIPsFromRequest(r), time.Now()); err != nil {
		log.Printf("Failed to save HubSpot contacts from request data: %v", err)
		return err
	}
	return nil
}
