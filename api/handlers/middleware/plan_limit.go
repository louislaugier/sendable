package middleware

import (
	"email-validator/config"
	"email-validator/internal/models"
	"log"
	"net/http"
)

func validateUserValidationCount(r *http.Request, validationOrigin models.ValidationOrigin, maxCount int) (bool, error) {
	count := GetUserFromRequest(r).ValidationCounts.AppValidationsCount
	if validationOrigin == models.APIValidation {
		count = GetUserFromRequest(r).ValidationCounts.APIValidationsCount
	}

	if count >= maxCount {
		return false, nil
	}

	return true, nil
}

func SingleValidationUserPlanLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := GetOriginFromRequest(r)
		currentPlan := GetUserFromRequest(r).CurrentPlan

		var maxCount int
		var validationOrigin models.ValidationOrigin
		switch origin {
		case config.FrontendURL:
			validationOrigin = models.AppValidation
			maxCount = config.MonthlyAppSingleValidationsLimits[currentPlan.Type]
		default:
			validationOrigin = models.APIValidation
			maxCount = config.MonthlyAPISingleValidationsLimits[currentPlan.Type]
		}

		validated, err := validateUserValidationCount(r, validationOrigin, maxCount)
		if err != nil {
			log.Printf("Failed to validate user count: %v", err)
			http.Error(w, "Internal Sever Error", http.StatusInternalServerError)
			return
		} else if !validated {
			http.Error(w, "Monthly email validation limit reached. Upgrade your current plan to increase your limits.", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}
