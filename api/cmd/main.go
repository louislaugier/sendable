package main

import (
	"email-validator/config"
	"email-validator/handlers/router"
)

func main() {
	config.Load()

	router.StartServer()
}
