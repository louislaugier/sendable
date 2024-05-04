package middleware

import (
	"context"
	"email-validator/config"
	"email-validator/internal/models"
	"net/http"
)

func ManageSingleValidationOrigin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		ctx := context.WithValue(r.Context(), requestOriginKey, origin)

		if origin != config.FrontendURL {
			// If the origin is not frontend, validate JWT and apply rate limits
			handler := ValidateJWT(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				next.ServeHTTP(w, r.WithContext(ctx))
			}), true)

			// Apply rate limit and plan limit here
			SingleValidationPlanLimit(SingleValidationRateLimit(handler)).ServeHTTP(w, r)
			return
		}

		// If the origin is frontend, proceed without additional checks
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ManageBulkValidationOrigin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		ctx := context.WithValue(r.Context(), requestOriginKey, origin)

		currentPlan := GetUserFromRequest(r).CurrentPlan

		// reject if a free / premium user attemps to use API to bulk validate
		if origin != config.FrontendURL && (currentPlan.Type == models.FreePlan || currentPlan.Type == models.PremiumOrder) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetValidationOriginType(origin string) models.ValidationOrigin {
	if origin == config.FrontendURL {
		return models.AppValidation
	} else {
		return models.APIValidation
	}
}
