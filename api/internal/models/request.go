package models

type (
	AuthGoogleRequest struct {
		AccessToken string `json:"access_token"`
		JWT         string `json:"jwt"`
	}
	AuthHubspotRequest struct {
		Code string `json:"code"`
	}
	AuthLinkedinRequest struct {
		Code string `json:"code"`
	}
	AuthMailchimpRequest struct {
		Code string `json:"code"`
	}
	AuthSalesforceRequest struct {
		Code         string `json:"code"`
		CodeVerifier string `json:"code_verifier"`
	}
	AuthZohoRequest struct {
		Code string `json:"code"`
	}
	AuthZohoSetEmailRequest struct {
		Email string `json:"email"`
	}

	ValidateEmailRequest struct {
		Email *string `json:"email"`
	}
	ValidateEmailsRequest struct {
		Emails []string `json:"emails,omitempty"`
	}

	ConfirmEmailAddressRequest struct {
		IsNewAccount          bool   `json:"isNewAccount"`
		Email                 string `json:"email"`
		EmailConfirmationCode int    `json:"emailConfirmationCode"`
	}
	UpdateEmailAddressRequest struct {
		Email string `json:"email"`
	}
	UpdatePasswordRequest struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}
)
