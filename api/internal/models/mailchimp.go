package models

type (
	MailchimpTokenReponse struct {
		AccessToken string `json:"access_token"`
		Token       string `json:"token_"`
	}

	MailchimpUser struct {
		Login struct {
			Email string `json:"login_email"`
		} `json:"login"`
		APIEndpoint string `json:"api_endpoint"`
	}

	MailchimpContactResponse struct {
		Members []MailchimpContact `json:"members"`
	}

	MailchimpContact struct {
		Email string `json:"email_address"`
	}

	ListResponse struct {
		Lists []struct {
			ID string `json:"id"`
		} `json:"lists"`
	}
)
