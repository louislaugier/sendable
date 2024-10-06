package oauth

import (
	"bytes"
	"sendable/config"
	"sendable/internal/models"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
)

func VerifyMailchimpCode(code string) (string, *models.MailchimpUser, error) {
	tokenURL := "https://login.mailchimp.com/oauth2/token"

	data := url.Values{
		"grant_type":    []string{"authorization_code"},
		"client_id":     []string{config.MailchimpOauthClientID},
		"client_secret": []string{config.MailchimpOauthClientSecret},
		"redirect_uri":  []string{config.MailchimpOauthRedirectURI},
		"code":          []string{code},
	}

	httpClient := &http.Client{}
	r, err := http.NewRequest("POST", tokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		return "", nil, err
	}
	r.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	resp, err := httpClient.Do(r)

	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	tokenResp := &models.MailchimpTokenReponse{}

	if err = json.Unmarshal(body, &tokenResp); err != nil {
		return "", nil, err
	}

	// use token to get user data
	accountDetailsURL := "https://login.mailchimp.com/oauth2/metadata"
	req, _ := http.NewRequest("GET", accountDetailsURL, nil)
	req.Header.Add("Authorization", "Bearer "+tokenResp.AccessToken)

	res, err := httpClient.Do(req)
	if err != nil {
		return "", nil, err
	}
	defer res.Body.Close()

	accountDetails, _ := io.ReadAll(res.Body)

	user := models.MailchimpUser{}
	if err = json.Unmarshal(accountDetails, &user); err != nil {
		return tokenResp.AccessToken, nil, err
	}

	return tokenResp.AccessToken, &user, nil
}
