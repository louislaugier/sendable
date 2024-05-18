package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func handle(mux *http.ServeMux, path string, handler http.Handler, withBaseRateLimit bool) {
	if withBaseRateLimit {
		mux.Handle(config.APIVersionPrefix+path,
			middleware.BaseRateLimit(
				middleware.Log(
					handler,
				),
			),
		)

		return
	}

	mux.Handle(config.APIVersionPrefix+path,
		middleware.Log(
			handler,
		),
	)
}

func handleHTTP(mux *http.ServeMux) {
	handle(mux, "/healthz", http.HandlerFunc(healthzHandler), true)

	// TODO: login
	// TODO: signup
	handle(mux, "/confirm_email", http.HandlerFunc(confirmEmailHandler), true)

	handle(mux, "/oauth/salesforce", http.HandlerFunc(salesforceAuthHandler), true)
	handle(mux, "/oauth/hubspot", http.HandlerFunc(hubspotAuthHandler), true)
	handle(mux, "/oauth/mailchimp", http.HandlerFunc(mailchimpAuthHandler), true)

	handle(mux, "/oauth/zoho", http.HandlerFunc(zohoAuthHandler), true)
	handle(mux, "/oauth/zoho/set_email", middleware.ValidateJWT(
		http.HandlerFunc(zohoAuthSetEmailHandler),
		false,
	), true)

	handle(mux, "/oauth/google", http.HandlerFunc(googleAuthHandler), true)
	handle(mux, "/oauth/linkedin", http.HandlerFunc(linkedinAuthHandler), true)

	handle(mux, "/me", middleware.ValidateJWT(
		http.HandlerFunc(meHandler),
		true,
	), true)

	handle(mux, "/validate_email",
		middleware.ValidateSingleValidationOriginAndLimits(
			http.HandlerFunc(validateEmailHandler),
		),
		false,
	)

	handle(mux, "/validate_emails",
		middleware.ValidateJWT(
			middleware.ValidateBulkValidationOriginAndLimits(
				http.HandlerFunc(validateEmailsHandler),
			),
			true,
		),
		false,
	)

	handle(mux, "/validation_history",
		middleware.ValidateJWT(
			http.HandlerFunc(getValidationHistoryHandler),
			true,
		),
		false,
	)

	handle(mux, "/reports/",
		middleware.ValidateReportToken(
			http.StripPrefix("/v1/reports",
				http.FileServer(
					http.Dir("./reports"),
				),
			),
		),
		true,
	)
}

func StartServer() {
	mux := http.NewServeMux()
	handleHTTP(mux) // Configure the routes

	server := http.NewServeMux()

	// Add CORS to all routes except validate_email and validate_emails
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/validate_email" || r.URL.Path == "/validate_emails" {
			mux.ServeHTTP(w, r) // Serve the request without CORS middleware
		} else {
			corsHandler := createCorsHandler(mux)
			corsHandler.ServeHTTP(w, r)
		}
	})

	switch config.OSEnv {
	case config.DevEnv:
		fmt.Println("HTTP server is listening on port 80...")
		if err := http.ListenAndServe(":80", server); err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	case config.ProdEnv:
		fmt.Println("HTTPS server is listening on port 443...")
		if err := http.ListenAndServeTLS(":443", "../cert.pem", "../key.pem", server); err != nil {
			if err = http.ListenAndServeTLS(":443", "cert.pem", "key.pem", server); err != nil {
				log.Fatal("ListenAndServeTLS: ", err)
			}
		}
	}
}

func createCorsHandler(mux *http.ServeMux) http.Handler {
	corsOptions := cors.New(cors.Options{
		// AllowedOrigins: []string{"*"}, // Allows all origins
		AllowedOrigins:   []string{config.FrontendURL, "http://127.0.0.1:3000"}, // The allowed domains
		AllowedMethods:   []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	return corsOptions.Handler(mux)
}

func handleError(w http.ResponseWriter, err error, message string, statusCode int) {
	log.Printf("%s: %v", message, err)
	http.Error(w, message, statusCode)
}
