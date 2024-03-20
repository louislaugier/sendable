package handlers

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func FacebookAuthHandler(w http.ResponseWriter, r *http.Request) {
	body := models.FacebookAuthRequest{}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	if body.AccessToken == "" {
		http.Error(w, "No token provided", http.StatusBadRequest)
		return
	}

	userInfo, err := oauth.VerifyFacebookAccessToken(body.AccessToken)
	if err != nil || userInfo == nil {
		if err != nil {
			log.Printf("Error verifying access token: %v", err)
		}
		http.Error(w, "Invalid access token", http.StatusUnauthorized)
		return
	}

	log.Println(userInfo.ID)
	log.Println(userInfo.Email)
	fmt.Fprint(w, http.StatusText(http.StatusOK))

	// TODO: get user by email / facebook_user_id
	// if nil, insert
	// return jwt + user
}
