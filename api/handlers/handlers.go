package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

const APIVersionPrefix = "/v1"

func addRouteWithPrefix(mux *http.ServeMux, path string, handler http.Handler) {
	mux.Handle(APIVersionPrefix+path, middleware.BaseRateLimit(middleware.Log(handler)))
}

func handleHTTP(mux *http.ServeMux) {
	addRouteWithPrefix(mux, "/healthz", http.HandlerFunc(healthzHandler))

	addRouteWithPrefix(mux, "/auth/salesforce", http.HandlerFunc(salesforceAuthHandler))
	addRouteWithPrefix(mux, "/auth/hubspot", http.HandlerFunc(hubspotAuthHandler))
	addRouteWithPrefix(mux, "/auth/zoho", http.HandlerFunc(zohoAuthHandler))
	addRouteWithPrefix(mux, "/auth/zoho/confirm_email", http.HandlerFunc(zohoAuthConfirmEmailHandler))
	addRouteWithPrefix(mux, "/auth/mailchimp", http.HandlerFunc(mailchimpAuthHandler))
	addRouteWithPrefix(mux, "/auth/google", http.HandlerFunc(googleAuthHandler))
	addRouteWithPrefix(mux, "/auth/linkedin", http.HandlerFunc(linkedinAuthHandler))

	addRouteWithPrefix(mux, "/validate_email", middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(validateEmailHandler))))
	addRouteWithPrefix(mux, "/validate_emails", middleware.ValidateFile(middleware.ValidateJWT(middleware.BulkValidatorRateLimit(middleware.Log(http.HandlerFunc(validateEmailsHandler))))))

	addRouteWithPrefix(mux, "/reports/", http.StripPrefix("/reports/", middleware.DownloadAuth(http.FileServer(http.Dir("./reports")))))
}

func StartHTTPSServer() {
	mux := http.NewServeMux()
	handleHTTP(mux) // Configure the routes

	// New CORS handler wrapping the mux with configured routes
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{config.FrontendURL, "http://127.0.0.1:3000"}, // The allowed domains
		AllowedMethods:   []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	corsHandler := corsOptions.Handler(mux)

	// Use the corsHandler when starting the server
	switch config.OSEnv {
	case config.DevEnv:
		fmt.Println("HTTP server is listening on port 80...")
		if err := http.ListenAndServe(":80", corsHandler); err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	case config.ProdEnv:
		fmt.Println("HTTPS server is listening on port 443...")
		if err := http.ListenAndServeTLS(":443", "../cert.pem", "../key.pem", corsHandler); err != nil {
			if err = http.ListenAndServeTLS(":443", "cert.pem", "key.pem", corsHandler); err != nil {
				log.Fatal("ListenAndServeTLS: ", err)
			}
		}
	}
}
