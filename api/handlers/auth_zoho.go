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
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"sendable/internal/pkg/zoho"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func ZohoAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.AuthZohoRequest{}

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

	u, err := handleZohoUser(accountOrgUserEmailsStr, r, accessToken)
	if err != nil {
		handleError(w, err, "Error handling Zoho user creation", http.StatusInternalServerError)
		return
	}

	handleZohoAuthResponse(w, u)
}

func handleZohoUser(emails string, r *http.Request, accessToken string) (*models.User, error) {
	u, err := user.GetByTempZohoOauthData(emails, utils.GetIPsFromRequest(r), r.UserAgent())
	if err != nil {
		if err.Error() == models.ErrEmailAlreadyTaken {
			existingUser, err := user.GetByEmail(emails)
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
		emailConfirmationCode, err := utils.GenerateRandomSixDigitCode()
		if err != nil {
			return nil, err
		}

		s := models.ZohoProvider
		u := &models.User{
			ID:                    uuid.New(),
			Email:                 emails,
			IsEmailConfirmed:      false,
			EmailConfirmationCode: emailConfirmationCode,
			LastIPAddresses:       utils.GetIPsFromRequest(r),
			LastUserAgent:         r.UserAgent(),
			AuthProvider:          &s,
		}

		go func() {
			if err := fetchAndSaveAllZohoContacts(accessToken, r); err != nil {
				log.Printf("Failed to save Zoho contacts from request data: %v", err)
			}
		}()

		err = user.InsertNew(u, nil)
		if err != nil {
			return nil, err
		}
	}

	return u, nil
}

func handleZohoAuthResponse(w http.ResponseWriter, u *models.User) {
	if u.Is2FAEnabled {
		json.NewEncoder(w).Encode(models.PreAuthUser{
			ID: u.ID,
		})

		return
	}

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

	return file.SaveStringsToNewCSV(contactEmails, fmt.Sprintf("./files/oauth_contacts/%s/user-%s.csv", models.ZohoProvider, middleware.GetUserFromRequest(r).ID), utils.GetIPsFromRequest(r), time.Now())
}
