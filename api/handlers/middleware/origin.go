package middleware

import (
	"context"
	"email-validator/config"
	"email-validator/internal/models"
	"net/http"
)

func ValidateSingleValidationOriginAndLimits(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := GetOriginFromRequest(r)
		ctx := context.WithValue(r.Context(), requestOriginKey, origin)

		if r.Header.Get("Authorization") != "" {
			ValidateJWT(
				ValidatePlanLimit(
					SingleValidationRateLimit(
						http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
							next.ServeHTTP(w, r)
						}),
					),
				),
				true,
			).ServeHTTP(w, r.WithContext(ctx))
			return
		}

		// If no Authorization header, apply rate limit middlewares directly
		SingleValidationRateLimit(next).ServeHTTP(w, r.WithContext(ctx))
	})
}

func ValidateBulkValidationOriginAndLimits(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := GetOriginFromRequest(r)
		ctx := context.WithValue(r.Context(), requestOriginKey, origin)

		currentPlan := GetUserFromRequest(r).CurrentPlan

		// reject if a free / premium user attempts to use API to bulk validate
		// free user can never bulk validate and premium user can only bulk validate via web app
		// only enterprise users can bulk validate with API
		if origin != config.FrontendURL && (currentPlan.Type == models.FreePlan || currentPlan.Type == models.PremiumOrder) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ValidateFile(
			ValidatePlanLimit(
				ValidateBulkValidationRateLimit(
					http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
						next.ServeHTTP(w, r)
					}),
				),
			),
		).ServeHTTP(w, r.WithContext(ctx))

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
