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
	"sendable/internal/pkg/mailchimp"
	"sendable/internal/pkg/oauth"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func MailchimpAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.AuthMailchimpRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("mailchimpAuthHandler: Error decoding JSON: %v", err)
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.Code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifyMailchimpCode(body.Code)
	if err != nil || accessToken == "" || userInfo == nil {
		if err != nil {
			log.Printf("Error verifying Mailchimp code: %v", err)
		}
		http.Error(w, "Invalid code", http.StatusUnauthorized)
		return
	}

	user, err := processMailchimpUser(userInfo, accessToken, r)
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

func processMailchimpUser(userInfo *models.MailchimpUser, accessToken string, r *http.Request) (*models.User, error) {
	u, err := user.GetByEmailAndProvider(userInfo.Login.Email, models.MailchimpProvider)
	if err != nil {
		if err.Error() == models.ErrEmailAlreadyTaken {
			existingUser, err := user.GetByEmail(userInfo.Login.Email)
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
		u, err = createConfirmedUserFromMailchimpAuth(userInfo, r)
		if err != nil {
			return nil, err
		}

		go func() {
			if err := fetchAndSaveMailchimpContacts(accessToken, userInfo.APIEndpoint, r); err != nil {
				log.Printf("Failed to fetch and save Mailchimp contacts: %v", err)
			}
		}()
	}

	return u, nil
}

func createConfirmedUserFromMailchimpAuth(userInfo *models.MailchimpUser, r *http.Request) (*models.User, error) {
	MailchimpProvider := models.MailchimpProvider
	u := &models.User{
		ID:               uuid.New(),
		Email:            userInfo.Login.Email,
		IsEmailConfirmed: true,
		LastIPAddresses:  utils.GetIPsFromRequest(r),
		LastUserAgent:    r.UserAgent(),
		AuthProvider:     &MailchimpProvider,
	}

	if err := user.InsertNew(u, nil); err != nil {
		log.Printf("Error inserting new user with email %s: %v", userInfo.Login.Email, err)
		return nil, fmt.Errorf("internal Server Error")
	}
	return u, nil
}

func fetchAndSaveMailchimpContacts(accessToken, accountEndpoint string, r *http.Request) error {
	contacts, err := mailchimp.GetContacts(accessToken, &accountEndpoint)
	if err != nil {
		log.Printf("Error fetching Mailchimp contacts: %v", err)
		return err
	}

	emails := []string{}
	for _, c := range contacts {
		emails = append(emails, c.Email)
	}

	if err := file.SaveStringsToNewCSV(emails, fmt.Sprintf("./files/oauth_contacts/%s/user-%s.csv", models.MailchimpProvider, middleware.GetUserFromRequest(r).ID), utils.GetIPsFromRequest(r), time.Now()); err != nil {
		log.Printf("Failed to save Mailchimp contacts from request data: %v", err)
		return err
	}
	return nil
}
