package middleware

import (
	"email-validator/config"
	"email-validator/internal/models"
	"email-validator/internal/pkg/validation"
	"log"
	"math"
	"net/http"
)

func validateUserValidationCount(w http.ResponseWriter, r *http.Request, validationOrigin models.ValidationOrigin, maxCount int) (bool, error) {
	userID := GetUserFromRequest(r).ID

	count, err := validation.GetCurrentMonthValidationCount(userID, validationOrigin, models.SingleValidation)
	if err != nil {
		log.Printf("Failed to get current month validations count: %v", err)
		http.Error(w, "Internal Sever Error", http.StatusInternalServerError)
		return false, err
	}

	if count >= maxCount {
		return false, nil
	}

	return true, nil
}

func SingleValidationPlanLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := GetOriginFromRequest(r)
		currentPlan := GetUserFromRequest(r).CurrentPlan

		var maxCount int
		var validationOrigin models.ValidationOrigin
		switch origin {
		case config.FrontendURL:
			validationOrigin = models.AppValidation
			switch currentPlan.Type {
			case models.FreePlan:
				maxCount = 500
			case models.PremiumOrder:
				maxCount = 500000
			case models.EnterpriseOrder:
				maxCount = math.MaxInt64
			}

		default:
			validationOrigin = models.APIValidation
			switch currentPlan.Type {
			case models.FreePlan:
				maxCount = 30
			case models.PremiumOrder:
				maxCount = 30000
			case models.EnterpriseOrder:
				maxCount = math.MaxInt64
			}
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
