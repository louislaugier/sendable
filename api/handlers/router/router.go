package router

import (
	"email-validator/config"
	"email-validator/handlers"
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/rs/cors"
)

func handle(mux *http.ServeMux, path string, handler http.Handler, withBaseRateLimit bool, customRateLimit ...*time.Duration) {
	var rl *time.Duration
	if len(customRateLimit) > 0 {
		rl = customRateLimit[0]
	}

	if withBaseRateLimit {
		mux.Handle(config.APIVersionPrefix+path,
			middleware.BaseRateLimit(
				middleware.Log(
					handler,
				),
				rl,
			),
		)
	} else {
		mux.Handle(config.APIVersionPrefix+path,
			middleware.Log(
				handler,
			),
		)
	}
}

func handleHTTP(mux *http.ServeMux) {
	handle(mux, "/healthz", http.HandlerFunc(handlers.HealthzHandler), true)

	// TODO: login
	// TODO: signup
	handle(mux, "/confirm_email_address", http.HandlerFunc(handlers.ConfirmEmailAddressHandler), true)

	handle(mux, "/auth_google", http.HandlerFunc(handlers.GoogleAuthHandler), true)
	handle(mux, "/auth_linkedin", http.HandlerFunc(handlers.LinkedinAuthHandler), true)
	handle(mux, "/auth_salesforce", http.HandlerFunc(handlers.SalesforceAuthHandler), true)
	handle(mux, "/auth_hubspot", http.HandlerFunc(handlers.HubspotAuthHandler), true)
	handle(mux, "/auth_mailchimp", http.HandlerFunc(handlers.MailchimpAuthHandler), true)
	handle(mux, "/auth_zoho", http.HandlerFunc(handlers.ZohoAuthHandler), true)
	handle(mux, "/auth_zoho/set_email", middleware.ValidateJWT(
		http.HandlerFunc(handlers.ZohoAuthSetEmailHandler),
		false,
	), true, func() *time.Duration {
		rateLimit := time.Minute
		return &rateLimit
	}())
	handle(mux, "/auth_2fa", http.HandlerFunc(handlers.Auth2FAHandler), true)

	handle(mux, "/me", middleware.ValidateJWT(
		http.HandlerFunc(handlers.MeHandler),
		true,
	), true)
	handle(mux, "/update_email_address", middleware.ValidateJWT(
		http.HandlerFunc(handlers.UpdateEmailAddressHandler),
		true,
	), true, func() *time.Duration {
		rateLimit := time.Minute
		return &rateLimit
	}())
	handle(mux, "/update_password", middleware.ValidateJWT(
		http.HandlerFunc(handlers.UpdateEmailAddressHandler),
		true,
	), true)
	handle(mux, "/enable_2fa", middleware.ValidateJWT(
		http.HandlerFunc(handlers.Enable2FAHandler),
		true,
	), true)
	handle(mux, "/disable_2fa", middleware.ValidateJWT(
		http.HandlerFunc(handlers.Disable2FAHandler),
		true,
	), true)
	handle(mux, "/delete_account", middleware.ValidateJWT(
		http.HandlerFunc(handlers.DeleteAccountHandler),
		true,
	), true)

	handle(mux, "/subscription_history",
		middleware.ValidateJWT(
			http.HandlerFunc(handlers.SubscriptionHistoryHandler),
			true,
		),
		true,
	)

	handle(mux, "/api_keys", middleware.ValidateJWT(
		http.HandlerFunc(handlers.APIKeysHandler),
		true,
	), true)
	handle(mux, "/generate_api_key", middleware.ValidateJWT(
		http.HandlerFunc(handlers.GenerateAPIKeyHandler),
		true,
	), true)
	handle(mux, "/generate_jwt", middleware.ValidateAPIKey( // generate JWT as API consumer (platform users)
		http.HandlerFunc(handlers.GenerateJWTHandler),
	), true)

	handle(mux, "/validate_email",
		middleware.ValidateSingleValidationOriginAndLimits( // calls ValidateJWT and checks limits if not guest
			http.HandlerFunc(handlers.ValidateEmailHandler),
		),
		false,
	)
	handle(mux, "/validate_emails",
		middleware.ValidateJWT(
			middleware.ValidateBulkValidationOriginAndLimits(
				http.HandlerFunc(handlers.ValidateEmailsHandler),
			),
			true,
		),
		false,
	)

	handle(mux, "/validation_history",
		middleware.ValidateJWT(
			http.HandlerFunc(handlers.ValidationHistoryHandler),
			true,
		),
		true,
	)
	handle(mux, "/validation_reports/",
		middleware.ValidateReportToken(
			http.StripPrefix(fmt.Sprintf("%s/validation_reports/", config.APIVersionPrefix),
				http.FileServer(
					http.Dir("./files/reports"),
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

	// Add CORS to all routes except generate_jwt, validate_email and validate_emails
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/generate_jwt" || r.URL.Path == "/validate_email" || r.URL.Path == "/validate_emails" {
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
		// AllowedOrigins:   []string{config.FrontendURL, "http://127.0.0.1:3000"}, // The allowed domains
		AllowedOrigins:   []string{config.FrontendURL}, // The allowed domains
		AllowedMethods:   []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	return corsOptions.Handler(mux)
}
