package middleware

import (
	"email-validator/config"
	"log"
	"net/http"
)

func SingleValidationPlanLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := GetValueFromContext(r.Context(), requestOriginKey)

		currentPlan := GetValueFromContext(r.Context(), userCurrentPlanKey)
		log.Println(currentPlan)

		// get current month validations count from db

		if origin == config.FrontendURL {
			// free: 500/mo
			// premium: 300000/mo
			// enterprise: unlimited
		} else {
			// free: 30/mo
			// premium: 10000/mo
			// enterprise: unlimited
		}

		next.ServeHTTP(w, r)
	})
}
