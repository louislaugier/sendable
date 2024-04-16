package main

import (
	"email-validator/config"
	"email-validator/handlers"
)

func main() {
	config.Load()

	handlers.StartServer()
}
