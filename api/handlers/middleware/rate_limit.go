package middleware

import (
	"email-validator/internal/models"
	"net/http"
	"time"
)

// RateLimit wraps an http.Handler and limits requests based on the provided rate limiter
func RateLimit(next http.Handler, limiter models.RateLimiter) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clientIP := r.RemoteAddr
		models.RateLimitMutex.Lock()
		clientInfo, ok := models.RateLimitClientMap[clientIP]
		if !ok {
			clientInfo = &models.ClientInfo{}
			models.RateLimitClientMap[clientIP] = clientInfo
		}
		models.RateLimitMutex.Unlock()

		clientInfo.Lock.Lock()
		defer clientInfo.Lock.Unlock()

		now := time.Now()
		elapsed := now.Sub(clientInfo.LastRequestTime)
		if elapsed < limiter.Limit {
			time.Sleep(limiter.Limit - elapsed)
		}

		clientInfo.LastRequestTime = time.Now()

		next.ServeHTTP(w, r)
	})
}

// BaseRateLimit wraps an http.Handler and limits requests based on the base rate limiter
func BaseRateLimit(h http.Handler) http.Handler {
	return RateLimit(h, models.BaseRateLimiter)
}

func SingleValidatorRateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get origin from context

		// if origin frontend:
		// 	1 concurrent validation per CLIENT (IP) max & 10 per hour

		// else:
		// 	if free: 1 concurrent validation per user max
		// 	if premium: 3 concurrent validations per user max
		// 	if enterprise: unlimited concurrent validations per user

		next.ServeHTTP(w, r)
	})
}

func BulkValidatorRateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// get origin from context

		// if origin == api && plan == free or premium: throw err
		// else: 1 concurrent validation batch per user

		next.ServeHTTP(w, r)
	})
}
