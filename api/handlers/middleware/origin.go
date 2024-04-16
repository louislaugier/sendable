package middleware

import (
	"log"
	"net/http"
)

func ManageSingleValidationOrigin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		log.Println(origin)
		// if origin not frontend, validate jwt
		// inject client origin in context

		next.ServeHTTP(w, r)
	})
}
