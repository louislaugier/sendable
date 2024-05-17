package models

type UserValidationCounts struct {
	AppValidationsCount int `json:"appValidationsCount"`
	APIValidationsCount int `json:"apiValidationsCount"`
}
