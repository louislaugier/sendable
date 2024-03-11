package models

import "net/http"

// StatusCodeRecorder is a ResponseWriter that keeps track of the status code.
type StatusCodeRecorder struct {
	http.ResponseWriter
	Status int
}

func (rec *StatusCodeRecorder) WriteHeader(code int) {
	rec.Status = code
	rec.ResponseWriter.WriteHeader(code)
}
