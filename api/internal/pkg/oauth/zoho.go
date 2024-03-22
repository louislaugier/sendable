package oauth

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

func VerifyZohoCode(code string) (string, error) {
	client := &http.Client{}

	data := url.Values{
		"code":          {code},
		"redirect_uri":  {"redirect_url"},
		"client_id":     {"client_id"},
		"client_secret": {"client_secret"},
		"grant_type":    {"authorization_code"},
	}

	req, err := http.NewRequest("POST", "https://accounts.zoho.com/oauth/v2/token", strings.NewReader(data.Encode()))
	if err != nil {
		return "", err
	}

	req.Header.Add("content-type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}

	json.NewDecoder(res.Body).Decode(&result)

	token, ok := result["access_token"].(string)
	if !ok {
		return "", errors.New("unable to get access token")
	}

	return token, nil
}

func getZohoUserInfo(accessToken string) (map[string]interface{}, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://www.zohoapis.com/crm/v2/org", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Zoho-oauthtoken %s", accessToken))

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var result map[string]interface{}

	json.NewDecoder(resp.Body).Decode(&result)

	return result, nil
}
