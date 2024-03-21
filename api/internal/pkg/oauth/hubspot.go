package oauth

import (
	"email-validator/config"
	"email-validator/internal/models"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func VerifyHubspotCode(code string) (string, *models.HubspotUser, error) {
	values := url.Values{}
	values.Set("grant_type", "authorization_code")
	values.Set("client_id", config.HubspotOauthClientID)
	values.Set("client_secret", config.HubspotOauthClientSecret)
	values.Set("redirect_uri", config.HubspotOauthRedirectURI)
	values.Set("code", code)

	requestBody := values.Encode()

	resp, err := http.Post("https://api.hubapi.com/oauth/v1/token", "application/x-www-form-urlencoded", strings.NewReader(requestBody))
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()

	// Read the response body first before decoding it
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, err
	}

	var accessTokenResp models.HubspotAccessTokenResponse
	err = json.Unmarshal(body, &accessTokenResp)
	if err != nil {
		return "", nil, err
	}

	userInfo, err := getUserInfo(accessTokenResp.AccessToken)
	if err != nil {
		return "", nil, err
	}

	return accessTokenResp.AccessToken, userInfo, nil
}

func getUserInfo(accessToken string) (*models.HubspotUser, error) {
	// Correct URL based on Hubspot documentation
	req, err := http.NewRequest("GET", "https://api.hubapi.com/oauth/v1/access-tokens/"+accessToken, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Checking the response status code
	if resp.StatusCode != http.StatusOK {
		return nil, err
	}

	var userInfo models.HubspotUser
	if err = json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
