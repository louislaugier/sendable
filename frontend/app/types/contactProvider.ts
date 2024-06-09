export enum ContactProviderType {
    Salesforce = "salesforce",
    Hubspot = "hubspot",
    Zoho = "zoho",
    Sendgrid = "sendgrid",
    Brevo = "brevo"
}

export interface ContactProvider {
    type: ContactProviderType
}