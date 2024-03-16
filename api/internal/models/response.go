// models/response_writer.go

package models

import (
	"net/http"
)

// ResponseWriter is our custom http.ResponseWriter that tracks the status code.
type ResponseWriter struct {
	http.ResponseWriter
	StatusCode int
}

// NewResponseWriter creates and returns a new ResponseWriter instance.
func NewResponseWriter(w http.ResponseWriter) *ResponseWriter {
	// Initialize the embedded ResponseWriter and default StatusCode
	return &ResponseWriter{ResponseWriter: w, StatusCode: http.StatusOK}
}

// Header returns the header map that will be sent by
// WriteHeader. Changing the header map after a call to
// WriteHeader (or Write) has no effect unless the modified
// headers are trailers.
func (rw *ResponseWriter) Header() http.Header {
	return rw.ResponseWriter.Header()
}

// WriteHeader captures the status code and delegates to the embedded ResponseWriter.
func (rw *ResponseWriter) WriteHeader(code int) {
	rw.StatusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// Write delegates to the embedded ResponseWriter.
func (rw *ResponseWriter) Write(b []byte) (int, error) {
	return rw.ResponseWriter.Write(b)
}
