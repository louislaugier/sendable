package models

type Template string

const (
	ConfirmEmailTemplate          Template = "confirm_email_address"
	EmailValidationReportTemplate Template = "email_validation_report"
	EmailValidationErrorTemplate  Template = "error"
)
