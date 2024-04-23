package models

type Template string

const (
	ConfirmEmailTemplate Template = "confirm"
	ReportTemplate       Template = "report"
	ErrorTemplate        Template = "error"
)
