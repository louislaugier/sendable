package middleware

import (
	"context"
	"email-validator/config"
	"net/http"
)

func ManageSingleValidationOrigin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		ctx := context.WithValue(r.Context(), requestOriginKey, origin)

		if origin != config.FrontendURL {
			// If the origin is not frontend, validate JWT
			ValidateJWT(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				next.ServeHTTP(w, r.WithContext(ctx))
			})).ServeHTTP(w, r)

			return
		}

		// If the origin is frontend, proceed without validating JWT (guest on landing page, 10 per hour and 1 at a time)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
