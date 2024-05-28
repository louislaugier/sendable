package models

type Template string

const (
	ConfirmEmailTemplate Template = "confirm_email_address"
	ReportTemplate       Template = "email_validation_report"
	ErrorTemplate        Template = "error"
)
