package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func handleHTTP(mux *http.ServeMux) {
	mux.Handle("/healthz", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(healthzHandler))))

	mux.Handle("/auth/salesforce", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(salesforceAuthHandler))))
	mux.Handle("/auth/hubspot", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(hubspotAuthHandler))))
	mux.Handle("/auth/zoho", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(zohoAuthHandler))))
	mux.Handle("/auth/zoho/confirm_email", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(zohoAuthConfirmEmailHandler))))
	mux.Handle("/auth/mailchimp", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(mailchimpAuthHandler))))
	mux.Handle("/auth/google", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(googleAuthHandler))))
	mux.Handle("/auth/linkedin", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(linkedinAuthHandler))))
	// mux.Handle("/auth/facebook", middleware.BaseRateLimit(middleware.Log(http.HandlerFunc(FacebookAuthHandler))))

	mux.Handle("/validate_email", middleware.ValidateJWT(middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(validateEmailHandler)))))
	mux.Handle("/validate_emails", middleware.ValidateFile(middleware.ValidateJWT(middleware.ValidatorRateLimit(middleware.Log(http.HandlerFunc(validateEmailsHandler))))))

	// Serve all the files under the "reports" subfolder
	mux.Handle("/reports/", http.StripPrefix("/reports/", middleware.DownloadAuth(http.FileServer(http.Dir("./reports")))))
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
