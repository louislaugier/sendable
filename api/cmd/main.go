package main

import (
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("env") == "DEV" {
		godotenv.Load("../.env")
	}
}
