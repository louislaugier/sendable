package middleware

import (
	"log"
	"net/http"
)

// TODO: manage empty file or inject in context
// TODO: transfer extension check from api/handlers/validate_emails.go to here
// TODO: clamav

func ValidateFile(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Content-Type") == "multipart/form-data" {
			preventSizeExceedingFile(w, r)
		}

		next.ServeHTTP(w, r)
	})
}

func preventSizeExceedingFile(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(30 << 20) // 30 MB maximum per request
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error parsing multipart form: %v", err)
		return
	}
}
