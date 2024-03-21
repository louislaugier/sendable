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

func SalesforceAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.SalesforceAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
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
			log.Printf("Error verifying code & code_verifier: %v", err)
		}
		http.Error(w, "Invalid JWT", http.StatusUnauthorized)
		return
	}

	contacts, err := salesforce.FetchContacts(accessToken)
	if err != nil {
		log.Fatalf("Error fetching Salesforce contacts: %s", err)
	}
	log.Println(contacts)

	fmt.Fprint(w, http.StatusText(http.StatusOK))

	// TODO: get user by email
	// if nil, insert
	// return jwt + user
}
