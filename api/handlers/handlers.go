package handlers

import (
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"
	"os"
)

func defineRoutes() {
	http.Handle("/healthz", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(HealthzHandler))))

	http.Handle("/auth", middleware.ValidateJWT(middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(AuthHandler)))))

	http.Handle("/validate_email", middleware.ValidateJWT(middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(ValidateEmailHandler)))))
	http.Handle("/validate_emails", middleware.FilterViruses(middleware.SizeLimit(middleware.ValidateJWT(middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(ValidateEmailsHandler)))))))
}

func StartHTTPSServer() {
	defineRoutes()

	if os.Getenv("env") == "DEV" {
		fmt.Println("HTTP server is listening on port 80...")
		err := http.ListenAndServe(":80", nil)
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}

	// fmt.Println("HTTPS server is listening on port 443...")
	// if err := http.ListenAndServeTLS(":443", "../cert.pem", "../key.pem", nil); err != nil {
	// 	if err = http.ListenAndServeTLS(":443", "cert.pem", "key.pem", nil); err != nil {
	// 		log.Fatal("ListenAndServe: ", err)
	// 	}
	// }
}
