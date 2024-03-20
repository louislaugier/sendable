package oauth

import (
	"bytes"
	"email-validator/config"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"

	"golang.org/x/oauth2"
)

// Replace these with your Salesforce client credentials and endpoint details
const (
	authURL     = "https://login.salesforce.com/services/oauth2/authorize"
	tokenURL    = "https://login.salesforce.com/services/oauth2/token"
	userInfoURL = "https://login.salesforce.com/services/oauth2/userinfo"
)

func VerifySalesforceCode(code string, codeVerifier string) (string, error) {
	conf := &oauth2.Config{
		ClientID:     config.SalesforceOauthClientID,
		ClientSecret: config.SalesforceOauthClientSecret,
		Endpoint: oauth2.Endpoint{
			TokenURL: tokenURL,
		},
	}

	// Manually create the request to include the code_verifier
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", conf.ClientID)
	data.Set("client_secret", conf.ClientSecret)
	data.Set("code", code)
	data.Set("redirect_uri", "http://localhost:3000")
	data.Set("code_verifier", codeVerifier)
	log.Println(data)

	// Create the HTTP request to exchange the code
	req, err := http.NewRequest("POST", conf.Endpoint.TokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		return "", fmt.Errorf("http.NewRequest() error: %v", err)
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	// Execute the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("client.Do() error: %v", err)
	}
	defer resp.Body.Close()

	// Check for a successful response
	if resp.StatusCode != http.StatusOK {
		body, err := io.ReadAll(resp.Body)
		if err == nil {
			return "", fmt.Errorf("non-ok status code: %v response body: %v", resp.StatusCode, string(body))
		}
		return "", fmt.Errorf("non-ok status code: %v", resp.StatusCode)
	}

	// Parse the JSON response to get the access token
	var token oauth2.Token
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return "", fmt.Errorf("json.Decode() error: %v", err)
	}

	// Use the access token to get the user info from Salesforce
	resp, err = client.Get(userInfoURL + "?oauth_token=" + token.AccessToken)
	if err != nil {
		return "", fmt.Errorf("client.Get() error: %v", err)
	}
	defer resp.Body.Close()

	// Read and return the user info
	userInfo, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("io.ReadAll() error: %v", err)
	}

	return string(userInfo), nil
}
