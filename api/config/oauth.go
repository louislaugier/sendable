package config

import "os"

var (
	GoogleOauthClientID,

	SalesforceOauthClientID,
	SalesforceOauthClientSecret,
	SalesforceOauthRedirectURI,
	SalesforceAppURL,

	HubspotOauthClientID,
	HubspotOauthClientSecret,
	HubspotOauthRedirectURI,

	ZohoOauthClientID,
	ZohoOauthClientSecret,
	ZohoOauthRedirectURI,

	MailchimpOauthClientID,
	MailchimpOauthClientSecret,
	MailchimpOauthRedirectURI,

	LinkedinOauthClientID,
	LinkedinOauthClientSecret,
	LinkedinOauthRedirectURI string
)

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

	MailchimpOauthClientID = os.Getenv("MAILCHIMP_OAUTH_CLIENT_ID")
	MailchimpOauthClientSecret = os.Getenv("MAILCHIMP_OAUTH_CLIENT_SECRET")
	MailchimpOauthRedirectURI = os.Getenv("MAILCHIMP_OAUTH_REDIRECT_URI")

	LinkedinOauthClientID = os.Getenv("LINKEDIN_OAUTH_CLIENT_ID")
	LinkedinOauthClientSecret = os.Getenv("LINKEDIN_OAUTH_CLIENT_SECRET")
	LinkedinOauthRedirectURI = os.Getenv("LINKEDIN_OAUTH_REDIRECT_URI")
}
