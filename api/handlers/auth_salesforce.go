package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/salesforce"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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

	contacts, err := salesforce.FetchContacts(accessToken)
	if err != nil {
		log.Printf("Error fetching Salesforce contacts: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	log.Println(userInfo)
	log.Println(contacts)

	fmt.Fprint(w, http.StatusText(http.StatusOK))

	// TODO: get user by email + provider
	// if nil, insert
	// return jwt + user
}
