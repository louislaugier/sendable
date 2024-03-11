package middleware

import (
	"bytes"
	"email-validator/internal/models"
	"email-validator/internal/pkg/format"
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

		// Call the next handler and record status code
		rec := &models.StatusCodeRecorder{ResponseWriter: w}
		next.ServeHTTP(rec, r)

		// Log request details with colored status code
		statusColor := format.ColorizeStatusCode(rec.Status)
		fmt.Printf("Request: %s %s - Headers: %v - Body: %s - IP: %s - Status: %s%d%s\n",
			r.Method, r.URL.Path, r.Header, string(body), GetIPsFromRequest(r), statusColor, rec.Status, "\x1b[0m")
	})
}
