package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppEnv string

const (
	DevEnv  AppEnv = "DEV"
	ProdEnv AppEnv = "PRD"
)

var Env AppEnv
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

	Env = AppEnv(os.Getenv("ENV"))
	if Env == "" {
		Env = DevEnv
	}

	domain := os.Getenv("DOMAIN")
	if domain == "" {
		FrontendURL = "http://localhost:3000"
		BaseURL = "http://localhost"
	} else {
		FrontendURL = fmt.Sprintf("https://%s", domain)
		BaseURL = fmt.Sprintf("https://api.%s", domain)
	}

	loadOauthClients()
}
