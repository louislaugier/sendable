package handlers

import (
	"email-validator/config"
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func handle(mux *http.ServeMux, path string, handler http.Handler) {
	mux.Handle(config.APIVersionPrefix+path,
		middleware.BaseRateLimit(
			middleware.Log(handler),
		),
	)
}

func handleHTTP(mux *http.ServeMux) {
	handle(mux, "/healthz", http.HandlerFunc(healthzHandler))

	// TODO: login
	// TODO: signup
	handle(mux, "/confirm_email", http.HandlerFunc(confirmEmailHandler))

	handle(mux, "/oauth/salesforce", http.HandlerFunc(salesforceAuthHandler))
	handle(mux, "/oauth/hubspot", http.HandlerFunc(hubspotAuthHandler))
	handle(mux, "/oauth/zoho", http.HandlerFunc(zohoAuthHandler))
	handle(mux, "/oauth/zoho/set_email", middleware.ValidateJWT(
		http.HandlerFunc(zohoAuthSetEmailHandler),
		false,
	),
	)
	handle(mux, "/oauth/mailchimp", http.HandlerFunc(mailchimpAuthHandler))
	handle(mux, "/oauth/google", http.HandlerFunc(googleAuthHandler))
	handle(mux, "/oauth/linkedin", http.HandlerFunc(linkedinAuthHandler))

	handle(mux, "/validate_email",
		middleware.ManageSingleValidationOrigin( // ManageSingleValidationOrigin calls SingleValidationRateLimit and only calls ValidateJWT & SingleValidationPlanLimit if origin is other than a guest on frontend
			http.HandlerFunc(validateEmailHandler),
		),
	)
	handle(mux, "/validate_emails",
		middleware.ValidateJWT(
			middleware.ManageBulkValidationOrigin( // reject if a free / premium user attemps to use API to bulk validate
				middleware.BulkValidationRateLimit(
					middleware.ValidateFile(
						http.HandlerFunc(validateEmailsHandler),
					),
				),
			), true,
		),
	)
	handle(mux, "/reports/",
		middleware.DownloadAuth(
			http.StripPrefix("/v1/reports",
				http.FileServer(
					http.Dir("./reports"),
				),
			),
		),
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

	// mux := http.NewServeMux()

	// mux.Handle("/reports/", http.StripPrefix("/reports", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	log.Println("Serving files from: ", r.URL.Path)
	// 	http.FileServer(http.Dir("./reports")).ServeHTTP(w, r)
	// })))

	// err := http.ListenAndServe(":80", mux)
	// if err != nil {
	// 	log.Fatal(err)
	// }
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
