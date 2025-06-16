package main

import (
	"log"
	"sendable/config"
	"sendable/handlers/router"
	"sendable/internal/pkg/scheduler"
)

func main() {
	config.Load()
	log.Println("ok123", config.FrontendURL)

	scheduler.Start()

	router.StartServer()
}
