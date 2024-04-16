package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env string

const (
	DevEnv  Env = "DEV"
	ProdEnv Env = "PRD"
)

var OSEnv = Env(os.Getenv("ENV"))

func loadEnvFile() {
	if err := godotenv.Load("../.env"); err != nil {
		if err = godotenv.Load("./.env"); err != nil {
			log.Fatal("godotenv.Load: ", err)
		}
	}
}

func loadEnv() {
	loadEnvFile()

	loadDomainURL()
	loadFrontendURL()

	loadOauthClients()
}
