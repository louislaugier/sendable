package middleware

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

// Log logs incoming requests
func Log(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Clone the request body to re-read it later
		var buf bytes.Buffer
		tee := io.TeeReader(r.Body, &buf)
		body, err := io.ReadAll(tee)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusInternalServerError)
			return
		}
		r.Body = io.NopCloser(&buf)

		// Log request details
		fmt.Printf("Request: %s %s - Headers: %v - Body: %s - IP: %s\n",
			r.Method, r.URL.Path, r.Header, string(body), GetIPsFromRequest(r))

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
