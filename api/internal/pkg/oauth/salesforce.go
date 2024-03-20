package oauth

import (
	"bytes"
	"email-validator/config"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
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

// TODO: return access token
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

// TODO: try other GPT4 method if doesn't work (SQL in query)
// Assuming accessToken is the token you've obtained in VerifySalesforceCode
func GetSalesforceContacts(accessToken string) ([]Contact, error) {
	contactsURL := "https://your_instance.salesforce.com/services/data/vXX.0/query/?q=SELECT+Id,Name,Email,Phone,AccountId+FROM+Contact"

	client := &http.Client{}
	req, err := http.NewRequest("GET", contactsURL, nil)
	if err != nil {
		return nil, fmt.Errorf("http.NewRequest() error: %v", err)
	}

	// Set the authorization header using the accessToken
	req.Header.Add("Authorization", "Bearer "+accessToken)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("client.Do() error: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, err := ioutil.ReadAll(resp.Body)
		if err == nil {
			return nil, fmt.Errorf("non-ok status code: %v response body: %v", resp.StatusCode, string(body))
		}
		return nil, fmt.Errorf("non-ok status code: %v", resp.StatusCode)
	}

	var result QueryResult
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("json.Decode() error: %v", err)
	}

	return result.Records, nil
}

// Contact represents a Salesforce Contact record
type Contact struct {
	ID        string `json:"Id"`
	Name      string `json:"Name"`
	Email     string `json:"Email"`
	Phone     string `json:"Phone"`
	AccountID string `json:"AccountId"`
}

// QueryResult represents a Salesforce API query result
type QueryResult struct {
	TotalSize int       `json:"totalSize"`
	Done      bool      `json:"done"`
	Records   []Contact `json:"records"`
}
