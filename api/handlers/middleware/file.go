package middleware

import (
	"log"
	"net/http"
)

// TODO: transfer extension check here
// TODO: clamav

// TODO: rename (ValidateFile?)
// SizeLimit ...
func SizeLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		preventSizeExceedingFile(w, r)

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
