package oauth

import (
	"bytes"
	"email-validator/config"
	"email-validator/internal/models"
	"encoding/json"
	"fmt"
	"io"
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

func VerifySalesforceCode(code string, codeVerifier string) (string, *models.SalesforceUser, error) {
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
	data.Set("redirect_uri", config.SalesforceOauthRedirectURI)
	data.Set("code_verifier", codeVerifier)

	// Create the HTTP request to exchange the code
	req, err := http.NewRequest("POST", conf.Endpoint.TokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		return "", nil, fmt.Errorf("http.NewRequest() error: %v", err)
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	// Execute the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", nil, fmt.Errorf("client.Do() error: %v", err)
	}
	defer resp.Body.Close()

	// Check for successful response
	if resp.StatusCode != http.StatusOK {
		body, err := io.ReadAll(resp.Body)
		if err == nil {
			return "", nil, fmt.Errorf("non-ok status code: %v response body: %v", resp.StatusCode, string(body))
		}
		return "", nil, fmt.Errorf("non-ok status code: %v", resp.StatusCode)
	}

	// Parse the JSON response to get the access token
	var token oauth2.Token
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return "", nil, fmt.Errorf("json.Decode() error: %v", err)
	}

	resp, err = client.Get(userInfoURL + "?oauth_token=" + token.AccessToken)
	if err != nil {
		return "", nil, fmt.Errorf("client.Get() error: %v", err)
	}
	defer resp.Body.Close()

	var user models.SalesforceUser
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return "", nil, fmt.Errorf("json.Decode() error: %v", err)
	}

	return token.AccessToken, &user, nil
}
