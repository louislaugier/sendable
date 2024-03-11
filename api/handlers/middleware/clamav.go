package middleware

import (
	"net/http"
)

// FilterViruses prevents files with viruses to be uploaded
func FilterViruses(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		preventSizeExceedingPayload(w, r)

		// TODO
		next.ServeHTTP(w, r)
	})
}
