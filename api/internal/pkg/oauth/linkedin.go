package oauth

import (
	"context"
	"email-validator/config"
	"email-validator/internal/models"
	"encoding/json"
	"io"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/linkedin"
)

func VerifyLinkedinCode(code string) (string, *models.LinkedinUser, error) {
	ctx := context.Background()

	linkedinOauthConfig := &oauth2.Config{
		ClientID:     config.LinkedinOauthClientID,
		ClientSecret: config.LinkedinOauthClientSecret,
		RedirectURL:  config.LinkedinOauthRedirectURI,
		Scopes:       []string{"email", "openid"},
		Endpoint:     linkedin.Endpoint,
	}

	token, err := linkedinOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return "", nil, err
	}

	client := linkedinOauthConfig.Client(ctx, token)
	resp, err := client.Get("https://api.linkedin.com/v2/userinfo")
	if err != nil {
		return "", nil, err
	}

	defer resp.Body.Close()
	data, _ := io.ReadAll(resp.Body)

	var res models.LinkedinUser

	json.Unmarshal([]byte(data), &res)

	return token.AccessToken, &res, nil
}
