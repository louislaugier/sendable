package config

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load("../.env"); err != nil {
		if err = godotenv.Load("./.env"); err != nil {
			log.Fatal("godotenv.Load: ", err)
		}
	}
}
