package config

import "os"

var GoogleOauthClientID string

var SalesforceOauthClientID string
var SalesforceOauthClientSecret string
var SalesforceOauthRedirectURI string
var SalesforceAppURL string

var HubspotOauthClientID string
var HubspotOauthClientSecret string
var HubspotOauthRedirectURI string

var ZohoOauthClientID string
var ZohoOauthClientSecret string
var ZohoOauthRedirectURI string

func loadOauthClients() {
	GoogleOauthClientID = os.Getenv("GOOGLE_OAUTH_CLIENT_ID")

	SalesforceOauthClientID = os.Getenv("SALESFORCE_OAUTH_CLIENT_ID")
	SalesforceOauthClientSecret = os.Getenv("SALESFORCE_OAUTH_CLIENT_SECRET")
	SalesforceOauthRedirectURI = os.Getenv("SALESFORCE_OAUTH_REDIRECT_URI")
	SalesforceAppURL = os.Getenv("SALESFORCE_APP_URL")

	HubspotOauthClientID = os.Getenv("HUBSPOT_OAUTH_CLIENT_ID")
	HubspotOauthClientSecret = os.Getenv("HUBSPOT_OAUTH_CLIENT_SECRET")
	HubspotOauthRedirectURI = os.Getenv("HUBSPOT_OAUTH_REDIRECT_URI")

	ZohoOauthClientID = os.Getenv("ZOHO_OAUTH_CLIENT_ID")
	ZohoOauthClientSecret = os.Getenv("ZOHO_OAUTH_CLIENT_SECRET")
	ZohoOauthRedirectURI = os.Getenv("ZOHO_OAUTH_REDIRECT_URI")
}
