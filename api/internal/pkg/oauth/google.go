package oauth

import (
	"context"
	"email-validator/config"
	"fmt"
	"net/http"

	"golang.org/x/oauth2"
	v2 "google.golang.org/api/oauth2/v2"
	"google.golang.org/api/option"
)

func VerifyAccessToken(ctx context.Context, accessToken string) (*v2.Userinfo, error) {
	// Initialize the OAuth2 service client with the access token
	config := &oauth2.Config{}
	httpClient := config.Client(ctx, &oauth2.Token{AccessToken: accessToken})

	// Create a new oauth2Service client
	oauth2Service, err := v2.NewService(ctx, option.WithHTTPClient(httpClient))
	if err != nil {
		return nil, fmt.Errorf("NewService: %v", err)
	}

	// Fetch user information using the OAuth2 service
	userinfoService := v2.NewUserinfoV2MeService(oauth2Service)
	userInfo, err := userinfoService.Get().Do()
	if err != nil {
		return nil, fmt.Errorf("UserinfoService.Get().Do: %v", err)
	}
	return userInfo, nil
}

func VerifyCredential(ctx context.Context, credential string) (*v2.Tokeninfo, error) {
	// Use a custom HTTP client, associated with your context
	httpClient := &http.Client{}

	// Create an OAuth2 service using the custom HTTP client
	service, err := v2.NewService(ctx, option.WithHTTPClient(httpClient))
	if err != nil {
		return nil, fmt.Errorf("oauth2.NewService: %v", err)
	}

	// Verify the credential using the tokeninfo endpoint and the OAuth2 service
	tokenInfoCall := service.Tokeninfo()
	tokenInfoCall.IdToken(credential)
	tokenInfo, err := tokenInfoCall.Do()
	if err != nil {
		return nil, fmt.Errorf("tokenInfoCall.Do: %v", err)
	}

	// Verify the token's audience to ensure it was intended for your client application
	if tokenInfo.Audience != config.GoogleOauthClientID {
		return nil, fmt.Errorf("wrong audience, got %v, wanted %v", tokenInfo.Audience, config.GoogleOauthClientID)
	}

	return tokenInfo, nil
}
