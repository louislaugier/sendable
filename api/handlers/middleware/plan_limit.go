package middleware

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/validation"
	"log"
	"net/http"
)

func validateUserValidationCount(w http.ResponseWriter, r *http.Request, validationOrigin models.ValidationOrigin, maxCount int) (bool, error) {
	userID := GetUserFromRequest(r).ID

	count, err := validation.GetCurrentMonthCount(userID, validationOrigin, false)
	if err != nil || count == nil {
		log.Printf("Failed to get current month validations count: %v", err)
		http.Error(w, "Internal Sever Error", http.StatusInternalServerError)
		return false, err
	}

	if *count >= maxCount {
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

		validated, err := validateUserValidationCount(w, r, validationOrigin, maxCount)
		if err != nil {
			log.Printf("Failed to validate user count: %v", err)
			http.Error(w, "Internal Sever Error", http.StatusInternalServerError)
			return
		} else if !validated {
			http.Error(w, "Limit reached", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}
