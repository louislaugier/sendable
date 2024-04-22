package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"email-validator/internal/pkg/zoho"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
)

func zohoAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.ZohoAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.Code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	accessToken, users, err := oauth.VerifyZohoCode(body.Code)
	if err != nil || accessToken == "" || users == nil {
		handleError(w, err, "Error verifying Zoho code", http.StatusUnauthorized)
		return
	}

	accountOrgUserEmails := make([]string, len(users))
	for _, u := range users {
		accountOrgUserEmails = append(accountOrgUserEmails, u.Email)
	}
	accountOrgUserEmailsStr := strings.Join(accountOrgUserEmails, ",")

	u, err := handleZohoUserCreation(accountOrgUserEmailsStr, r)
	if err != nil {
		handleError(w, err, "Error handling Zoho user creation", http.StatusInternalServerError)
		return
	}

	handleZohoDataFetching(w, r, accessToken, u)
}

func handleZohoUserCreation(emails string, r *http.Request) (*models.User, error) {
	u, err := user.GetByTempZohoOauthData(emails, utils.GetIPsFromRequest(r), r.UserAgent())
	if err != nil {
		return nil, err
	}
	if u == nil {
		s := models.ZohoProvider
		u := &models.User{
			ID:               uuid.New(),
			Email:            emails,
			IsEmailConfirmed: false,
			LastIPAddresses:  utils.GetIPsFromRequest(r),
			LastUserAgent:    r.UserAgent(),
			AuthProvider:     &s,
		}

		err = user.InsertNew(u, nil)
		if err != nil {
			return nil, err
		}
	}

	return u, nil
}

func handleZohoDataFetching(w http.ResponseWriter, r *http.Request, accessToken string, u *models.User) {
	go func() {
		if err := fetchAndSaveAllZohoContacts(accessToken, r); err != nil {
			log.Printf("Failed to save Zoho contacts from request data: %v", err)
		}
	}()

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}

func fetchAndSaveAllZohoContacts(accessToken string, r *http.Request) error {
	contacts, err := zoho.GetContacts(accessToken)
	if err != nil {
		return err
	}
	leads, err := zoho.GetLeads(accessToken)
	if err != nil {
		return err
	}
	vendors, err := zoho.GetVendors(accessToken)
	if err != nil {
		return err
	}

	contactEmails := make([]string, 0)
	for _, c := range contacts {
		contactEmails = append(contactEmails, c.Email)
	}
	for _, l := range leads {
		contactEmails = append(contactEmails, l.Email)
	}
	for _, v := range vendors {
		contactEmails = append(contactEmails, v.Email)
	}

	return file.SaveStringsToNewCSV(contactEmails, fmt.Sprintf("./uploads/oauth_contacts/%s/user-%s.csv", models.ZohoProvider, middleware.GetUserIDFromRequest(r)), utils.GetIPsFromRequest(r), time.Now())
}
