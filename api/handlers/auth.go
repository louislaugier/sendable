package handlers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost/auth/google_callback",
	ClientID:     "YOUR_CLIENT_ID.apps.googleusercontent.com",
	ClientSecret: "YOUR_CLIENT_SECRET",
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
	Endpoint:     google.Endpoint,
}

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	// Generate a new state string for this login attempt and set it as a cookie
	oauthState, err := generateStateOauthCookie(w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	url := googleOauthConfig.AuthCodeURL(oauthState)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func Callback(w http.ResponseWriter, r *http.Request) {
	// Read oauthstate from cookie
	oauthState, err := r.Cookie("oauthstate")
	if err != nil {
		http.Error(w, "Invalid state parameter", http.StatusBadRequest)
		return
	}

	if r.FormValue("state") != oauthState.Value {
		http.Error(w, "Invalid state parameter", http.StatusBadRequest)
		return
	}

	code := r.URL.Query().Get("code")
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("Code exchange failed: %s\n", err.Error())
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		log.Printf("Failed getting user info: %s\n", err.Error())
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()

	contents, err := io.ReadAll(response.Body)
	if err != nil {
		log.Printf("Failed reading response body: %s\n", err.Error())
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	log.Printf("Content: %s\n", contents)
	fmt.Fprintf(w, "Content: %s\n", contents)
}

func generateStateOauthCookie(w http.ResponseWriter) (string, error) {
	var expiration = time.Now().Add(365 * 24 * time.Hour)
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", errors.New("failed to generate random state")
	}
	state := base64.URLEncoding.EncodeToString(b)

	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration, HttpOnly: true}
	http.SetCookie(w, &cookie)

	return state, nil
}
