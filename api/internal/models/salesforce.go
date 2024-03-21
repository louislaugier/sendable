package models

type SalesforceAuthRequest struct {
	Code         string `json:"code"`
	CodeVerifier string `json:"code_verifier"`
}

type SalesforceUser struct {
	Email    string              `json:"email"`
	Name     string              `json:"name"`
	Locale   string              `json:"locale"`
	Contacts []SalesforceContact `json:"contacts,omitempty"`
}

type SalesforceContact struct {
	Email     string `json:"Email"`
	Phone     string `json:"Phone"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
}

type SalesforceContactsResponse struct {
	TotalSize int                 `json:"total_size"`
	Done      bool                `json:"done"`
	Records   []SalesforceContact `json:"records"`
}
