package middleware

import (
	"net/http"
	"sendable/config"
	"sendable/internal/models"
)

func ValidateSingleValidationOriginAndLimits(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
			).ServeHTTP(w, r)
		} else {
			// If no Authorization header, apply rate limit middlewares directly
			SingleValidationRateLimit(next).ServeHTTP(w, r)
		}
	})
}

func ValidateBulkValidationOriginAndLimits(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// reject if a free / premium user attempts to use API to bulk validate
		// free user can never bulk validate and premium user can only bulk validate via web app
		// only enterprise users can bulk validate with API
		currentPlan := GetUserFromRequest(r).CurrentPlan
		if GetOriginFromRequest(r) != config.FrontendURL && currentPlan.Type != models.EnterpriseSubscription {
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
		).ServeHTTP(w, r)
	})
}

func GetValidationOriginType(originURL string) models.ValidationOrigin {
	if originURL == config.FrontendURL {
		return models.AppValidation
	} else {
		return models.APIValidation
	}
}
