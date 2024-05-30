package middleware

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"time"

	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/format"
	"email-validator/internal/pkg/utils"
)

// Log is a middleware function that logs HTTP requests.
func Log(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip logging body for specific paths or multipart form-data
		skipBodyLogging := r.URL.Path == fmt.Sprintf("%s/validate_emails", config.APIVersionPrefix) || utils.IsMultipartFormContentType(r)

		var body string
		if skipBodyLogging {
			body = "[body not logged]"
		} else {
			// Clone the request body so we can log it and then re-use it
			var buf bytes.Buffer
			tee := io.TeeReader(r.Body, &buf)
			bodyBytes, err := io.ReadAll(tee)
			if err != nil {
				http.Error(w, "Failed to read request body", http.StatusInternalServerError)
				return
			}
			defer r.Body.Close()
			r.Body = io.NopCloser(&buf)
			body = string(bodyBytes)
		}

		// Use our custom ResponseWriter from the models package
		customWriter := models.NewResponseWriter(w)

		// Call the next handler and record the status code. Note that customWriter is directly passed without dereference.
		next.ServeHTTP(customWriter, r)

		// After the next handler serves the request, log the request with status color.
		statusColor := format.ColorizeRequestLog(customWriter.StatusCode)

		// Get current time
		currentTime := time.Now().UTC().Format("2006-01-02 15:04:05")

		// Wrap the entire log message with the color based on status code
		fmt.Printf("%s[%s] Request: %s %s - Headers: %v - Body: %s - IP: %s - Status: %d%s\n",
			statusColor, currentTime, r.Method, r.URL.Path, r.Header, body, utils.GetIPsFromRequest(r), customWriter.StatusCode, "\x1b[0m")
	})
}
