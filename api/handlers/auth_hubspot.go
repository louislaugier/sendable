package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/hubspot"
	"email-validator/internal/pkg/oauth"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func hubspotAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.HubspotAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("HubspotAuthHandler: Error decoding JSON: %v", err)
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.Code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	accessToken, userInfo, err := oauth.VerifyHubspotCode(body.Code)
	if err != nil || accessToken == "" || userInfo == nil {
		if err != nil {
			log.Printf("Error verifying Hubspot code: %v", err)
		}
		http.Error(w, "Invalid code", http.StatusUnauthorized)
		return
	}

	contacts, err := hubspot.GetContacts(accessToken)
	if err != nil {
		log.Printf("Error fetching Hubspot contacts: %v", err)
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
