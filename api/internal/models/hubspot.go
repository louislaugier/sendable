package models

type (
	HubspotAuthRequest struct {
		Code string `json:"code"`
	}

	HubspotAccessTokenResponse struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
		ExpiresIn    int    `json:"expires_in"`
	}

	HubspotUser struct {
		Email    string           `json:"user"`
		Contacts []HubspotContact `json:"contacts,omitempty"`
	}

	HubspotContact struct {
		Properties struct {
			Email     string `json:"email"`
			FirstName string `json:"firstname"`
			LastName  string `json:"lastname"`
		} `json:"properties"`
	}

	HubspotContactsResponse struct {
		Results []HubspotContact `json:"results"`
	}
)
