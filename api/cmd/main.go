package main

import (
	"email-validator/config"
	"email-validator/handlers"
	"email-validator/handlers/middleware"
	"net/http"
)

func main() {
	config.LoadEnv()

	http.HandleFunc("/healthz", handlers.HealthzHandler)
	http.Handle("/auth", middleware.ValidateJWT(http.HandlerFunc(handlers.AuthHandler)))
	http.Handle("/validate_email", middleware.ValidateJWT(http.HandlerFunc(handlers.ValidateEmailHandler)))

	handlers.StartHTTPSServer()
}
