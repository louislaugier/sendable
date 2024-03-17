package config

import "os"

var GoogleOauthClientID string

func LoadOauthClients() {
	GoogleOauthClientID = os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
}
