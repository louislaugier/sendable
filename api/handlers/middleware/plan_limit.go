package middleware

import (
	"net/http"
)

func SingleValidationPlanLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get current month single_validations count from db

		// get origin from context

		// if origin frontend
		// free: 500/mo
		// premium: 300000/mo
		// enterprise: unlimited

		// else
		// free: 30/mo
		// premium: 10000/mo
		// enterprise: unlimited

		next.ServeHTTP(w, r)
	})
}
