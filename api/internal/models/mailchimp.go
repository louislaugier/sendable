package models

type MailchimpAuthRequest struct {
	Code string `json:"code"`
}

type MailchimpTokenReponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
}

type MailchimpUser struct {
	Login struct {
		Email string `json:"login_email"`
	} `json:"login"`
	APIEndpoint string `json:"api_endpoint"`
}

type MailchimpContactResponse struct {
	Members []MailchimpContact `json:"members"`
}

type MailchimpContact struct {
	Email string `json:"email_address"`
}

type ListResponse struct {
	Lists []struct {
		ID string `json:"id"`
	} `json:"lists"`
}
