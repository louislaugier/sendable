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

// ValidatorRateLimit wraps an http.Handler and limits requests based on the validator rate limiter
func ValidatorRateLimit(h http.Handler) http.Handler {
	return RateLimit(h, models.ValidatorRateLimiter)
}
