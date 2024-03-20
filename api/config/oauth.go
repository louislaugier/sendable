package config

import "os"

var GoogleOauthClientID string

var SalesforceOauthClientID string
var SalesforceOauthClientSecret string

func LoadOauthClients() {
	GoogleOauthClientID = os.Getenv("GOOGLE_OAUTH_CLIENT_ID")

	SalesforceOauthClientID = os.Getenv("SALESFORCE_OAUTH_CLIENT_ID")
	SalesforceOauthClientSecret = os.Getenv("SALESFORCE_OAUTH_CLIENT_SECRET")
}
