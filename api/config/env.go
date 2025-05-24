package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

var FrontendURL string
var BaseURL string

func loadEnvFile() {
	if err := godotenv.Load("../.env"); err != nil {
		if err = godotenv.Load("./.env"); err != nil {
			log.Fatal("godotenv.Load: ", err)
		}
	}
}

func loadEnv() {
	loadEnvFile()

	domain := os.Getenv("DOMAIN")
	log.Println("ok456", domain, os.Getenv("JWT_SECRET_KEY"))
	if domain == "" {
		FrontendURL = "http://localhost:3000"
		BaseURL = "http://localhost"
	} else {
		FrontendURL = fmt.Sprintf("https://%s", domain)
		BaseURL = fmt.Sprintf("https://api.%s", domain)
	}

	loadOauthClients()
}
