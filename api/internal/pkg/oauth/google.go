package oauth

import (
	"context"
	"net/http"

	"google.golang.org/api/oauth2/v2"
	"google.golang.org/api/option"
)

func VerifyGoogleClientID(ctx context.Context, clientID string) (*oauth2.Tokeninfo, error) {
	httpClient := &http.Client{}
	oauth2Service, err := oauth2.NewService(ctx, option.WithHTTPClient(httpClient))
	if err != nil {
		return nil, err
	}

	tokenInfoCall := oauth2Service.Tokeninfo()
	tokenInfoCall.IdToken(clientID)
	tokenInfo, err := tokenInfoCall.Do()
	if err != nil {
		return nil, err
	}

	// if !tokenInfo.VerifiedEmail {
	// 	return nil, errors.New("email not verified")
	// }

	return tokenInfo, nil
}
