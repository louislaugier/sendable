export enum ContactProviderType {
    Salesforce = "salesforce",
    Hubspot = "hubspot",
    Zoho = "zoho",
    Sendgrid = "sendgrid",
    Mailchimp = 'mailchimp',
    Brevo = "brevo"
}

export interface ContactProvider {
    type: ContactProviderType
    latestApiKeyChars: string
}