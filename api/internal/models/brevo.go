package models

type (
	BrevoContact struct {
		Attributes struct {
			FirstName string `json:"FIRSTNAME"`
			LastName  string `json:"LASTNAME"`
			SMS       string `json:"SMS"`
		} `json:"attributes"`
		Email            string `json:"email"`
		EmailBlacklisted bool   `json:"emailBlacklisted"`
	}
)
