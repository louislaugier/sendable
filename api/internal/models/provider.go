package models

type SignupProvider string

const (
	GoogleProvider   SignupProvider = "google"
	LinkedinProvider SignupProvider = "linkedin"

	SalesforceProvider SignupProvider = "salesforce"
	ZohoProvider       SignupProvider = "zoho"
	HubspotProvider    SignupProvider = "hubspot"

	MailchimpProvider SignupProvider = "mailchimp"
)

type Provider struct {
}
