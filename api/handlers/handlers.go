package handlers

import (
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

func handleHTTP(mux *http.ServeMux) {
	// Configure the handlers without CORS first
	mux.Handle("/healthz", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(HealthzHandler))))

	mux.Handle("/auth/salesforce", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(SalesforceAuthHandler))))
	mux.Handle("/auth/google", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(GoogleAuthHandler))))
	mux.Handle("/auth/facebook", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(FacebookAuthHandler))))

	mux.Handle("/validate_email", middleware.ValidateJWT(middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(ValidateEmailHandler)))))
	mux.Handle("/validate_emails", middleware.SizeLimit(middleware.ValidateJWT(middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(ValidateEmailsHandler))))))

	// Serve all the files under the "reports" subfolder
	mux.Handle("/reports/", http.StripPrefix("/reports/", middleware.DownloadAuth(http.FileServer(http.Dir("./reports")))))
}

func StartHTTPSServer() {
	mux := http.NewServeMux()
	handleHTTP(mux) // Configure the routes

	// New CORS handler wrapping the mux with configured routes
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://d854-143-244-44-162.ngrok-free.app"}, // The allowed domains
		AllowedMethods:   []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	corsHandler := corsOptions.Handler(mux)

	// Use the corsHandler when starting the server
	if os.Getenv("ENV") == "DEV" {
		fmt.Println("HTTP server is listening on port 80...")
		if err := http.ListenAndServe(":80", corsHandler); err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	} else {
		fmt.Println("HTTPS server is listening on port 443...")
		if err := http.ListenAndServeTLS(":443", "../cert.pem", "../key.pem", corsHandler); err != nil {
			if err = http.ListenAndServeTLS(":443", "cert.pem", "key.pem", corsHandler); err != nil {
				log.Fatal("ListenAndServeTLS: ", err)
			}
		}
	}
}
