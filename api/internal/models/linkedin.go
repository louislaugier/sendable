package models

type (
	LinkedinAuthRequest struct {
		Code string `json:"code"`
	}

	LinkedinUser struct {
		Email string `json:"email"`
	}
)
