package models

type Provider string

const (
	GoogleProvider   Provider = "google"
	LinkedinProvider Provider = "linkedin"
	// FacebookProvider Provider = "facebook"
	// AppleProvider    Provider = "apple"

	SalesforceProvider Provider = "salesforce"
	ZohoProvider       Provider = "zoho"
	HubspotProvider    Provider = "hubspot"

	MailchimpProvider Provider = "mailchimp"
)
