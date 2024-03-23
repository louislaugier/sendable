package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env string

var OSEnv = Env(os.Getenv("ENV"))

const (
	DevEnv  Env = "DEV"
	ProdEnv Env = "PRD"
)

func loadEnv() {
	if err := godotenv.Load("../.env"); err != nil {
		if err = godotenv.Load("./.env"); err != nil {
			log.Fatal("godotenv.Load: ", err)
		}
	}

	loadDomainURL()

	loadFrontendURL()

	loadOauthClients()
}
