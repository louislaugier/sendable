package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/mailchimp"
	"email-validator/internal/pkg/oauth"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func mailchimpAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.MailchimpAuthRequest{}

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

	contacts, err := mailchimp.GetContacts(accessToken, &userInfo.APIEndpoint)
	if err != nil {
		log.Printf("Error fetching Mailchimp contacts: %v", err)
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
