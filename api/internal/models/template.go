package models

type Template string

const (
	ConfirmEmailAddressTemplate   Template = "confirm_email_address"
	ResetPasswordTemplate         Template = "reset_password"
	EmailValidationReportTemplate Template = "email_validation_report"
	EmailValidationErrorTemplate  Template = "email_validation_error"
)
