package main

import (
	"sendable/config"
	"sendable/handlers/router"
)

func main() {
	config.Load()

	router.StartServer()
}
