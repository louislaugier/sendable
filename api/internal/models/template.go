package models

type Template string

const (
	ConfirmEmailAddressTemplate   Template = "confirm_email_address"
	UpdateEmailAddressTemplate    Template = "update_email_address"
	EmailValidationReportTemplate Template = "email_validation_report"
	EmailValidationErrorTemplate  Template = "email_validation_error"
)
