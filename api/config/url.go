package config

import "os"

var DomainURL string
var FrontendURL string

func loadDomainURL() {
	DomainURL = os.Getenv("DOMAIN_URL")
}

func loadFrontendURL() {
	FrontendURL = os.Getenv("FRONTEND_URL")
}
