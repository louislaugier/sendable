package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"email-validator/internal/pkg/zoho"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func zohoAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.ZohoAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("ZohoAuthHandler: Error decoding JSON: %v", err)
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.Code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	accessToken, users, err := oauth.VerifyZohoCode(body.Code)
	if err != nil || accessToken == "" || users == nil {
		if err != nil {
			log.Printf("Error verifying Zoho code: %v", err)
		}
		http.Error(w, "Invalid code", http.StatusUnauthorized)
		return
	}

	contacts, err := zoho.GetContacts(accessToken)
	if err != nil {
		log.Printf("Error fetching Zoho contacts: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	leads, err := zoho.GetLeads(accessToken)
	if err != nil {
		log.Printf("Error fetching Zoho leads: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	vendors, err := zoho.GetVendors(accessToken)
	if err != nil {
		log.Printf("Error fetching Zoho vendors: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	log.Println(users)
	log.Println(contacts, leads, vendors)

	fmt.Fprint(w, http.StatusText(http.StatusOK))

	// TODO: get user by {emails separated by coma;IP;userAgent}
	// if nil, insert
	// return jwt + user
}
