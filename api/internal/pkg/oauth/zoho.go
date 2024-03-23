package oauth

import (
	"email-validator/config"
	"email-validator/internal/models"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

func VerifyZohoCode(code string) (string, []models.ZohoUser, error) {
	client := &http.Client{}

	data := url.Values{
		"code":          {code},
		"redirect_uri":  {config.ZohoOauthRedirectURI},
		"client_id":     {config.ZohoOauthClientID},
		"client_secret": {config.ZohoOauthClientSecret},
		"grant_type":    {"authorization_code"},
	}

	req, err := http.NewRequest("POST", "https://accounts.zoho.com/oauth/v2/token", strings.NewReader(data.Encode()))
	if err != nil {
		return "", nil, err
	}

	req.Header.Add("content-type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)
	if err != nil {
		return "", nil, err
	}

	var result map[string]interface{}

	json.NewDecoder(res.Body).Decode(&result)
	token, ok := result["access_token"].(string)
	if !ok {
		return "", nil, errors.New("unable to get access token")
	}

	users, err := getZohoUsersInfo(token)
	if err != nil {
		return "", nil, err
	}

	return token, users, nil
}

func getZohoUsersInfo(accessToken string) ([]models.ZohoUser, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://www.zohoapis.com/crm/v2/users", nil)

	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Zoho-oauthtoken %s", accessToken))

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var result models.ZohoUsersResponse

	json.NewDecoder(resp.Body).Decode(&result)

	return result.Users, nil
}
