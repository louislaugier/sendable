package models

import "github.com/google/uuid"

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
	Auth2FARequest struct {
		UserID                      uuid.UUID `json:"userId"`
		TwoFactorAuthenticationCode *int      `json:"twoFactorAuthenticationCode"`
	}

	ValidateEmailRequest struct {
		Email *string `json:"email"`
	}
	ValidateEmailsRequest struct {
		Emails []string `json:"emails,omitempty"`
	}

	ConfirmEmailAddressRequest struct {
		IsNewAccount          bool   `json:"isNewAccount"`
		IsZohoConfirmation    bool   `json:"isZohoConfirmation"`
		Email                 string `json:"email"`
		EmailConfirmationCode *int   `json:"emailConfirmationCode"`
	}
	UpdateEmailAddressRequest struct {
		Email string `json:"email"`
	}
	UpdatePasswordRequest struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}
	Enable2FARequest struct {
		TwoFactorAuthenticationCode   *int   `json:"twoFactorAuthenticationCode"`
		TwoFactorAuthenticationSecret string `json:"twoFactorAuthenticationSecret"`
	}
	Disable2FARequest struct {
		TwoFactorAuthenticationCode *int `json:"twoFactorAuthenticationCode"`
	}
	DeleteAPIKeyRequest struct {
		ID *uuid.UUID `json:"id"`
	}
	SignupRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	ResetPasswordRequest struct {
		Email string `json:"email"`
	}
	SetPasswordRequest struct {
		Email                 string `json:"email"`
		EmailConfirmationCode *int   `json:"emailConfirmationCode"`
		Password              string `json:"password"`
	}
	CheckoutRequest struct {
		PriceID string `json:"priceId"`
	}
)
