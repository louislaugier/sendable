package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/user"
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
)

func salesforceAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.SalesforceAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("salesforceAuthHandler: Error decoding JSON: %v", err)
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.Code == "" || body.CodeVerifier == "" {
		http.Error(w, "Missing code & code_verifier pair", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifySalesforceCode(body.Code, body.CodeVerifier)
	if err != nil || accessToken == "" || userInfo == nil {
		if err != nil {
			log.Printf("Error verifying Salesforce code & code_verifier: %v", err)
		}
		http.Error(w, "Invalid code & code_verifier", http.StatusUnauthorized)
		return
	}

	u, err := user.GetByEmailAndProvider(userInfo.Email, models.SalesforceProvider)
	if err != nil {
		log.Printf("Error attempting to fetch user with email %s: %v", userInfo.Email, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if u == nil {
		salesforceProvider := models.SalesforceProvider
		u = &models.User{
			ID:               uuid.New(),
			Email:            userInfo.Email,
			IsEmailConfirmed: true,
			LastIPAddresses:  middleware.GetIPsFromRequest(r),
			LastUserAgent:    r.Header.Get("User-Agent"),
			AuthProvider:     &salesforceProvider,
		}

		err = user.InsertNew(u, nil)
		if err != nil {
			log.Printf("Error inserting new user with email %s: %v", userInfo.Email, err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// contacts, err := salesforce.FetchContacts(accessToken)
		// if err != nil {
		// 	log.Printf("Error fetching Salesforce contacts: %s", err)
		// 	http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		// 	return
		// }
		// log.Println(contacts)

		// save contacts in file with userID as prefix + timestamp as suffix
	}

	err = middleware.GenerateAndBindJWT(u)
	if err != nil {
		log.Printf("Error attempting to generate & bind jwt to user %s: %v", userInfo.Email, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(u)
}
