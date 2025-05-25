package main

import (
	"sendable/config"
	"sendable/handlers/router"
	"sendable/internal/pkg/scheduler"
)

func main() {
	config.Load()

	scheduler.Start()

	router.StartServer()
}
