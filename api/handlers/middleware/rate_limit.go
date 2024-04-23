package middleware

import (
	"email-validator/config"
	"email-validator/internal/models"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
)

// Global variables
var bulkValidationMutex sync.Mutex
var bulkValidationMap = make(map[string]bool)

// BulkValidationRateLimit limits simultaneous bulk validation requests per user.
func BulkValidationRateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := GetUserFromRequest(r).ID
		if !acquireBulkValidationLock(userID) {
			http.Error(w, "Another batch validation is currently running", http.StatusTooManyRequests)
			return
		}
		defer releaseBulkValidationLock(userID)
		next.ServeHTTP(w, r)
	})
}

// acquireBulkValidationLock attempts to acquire a lock for a user to start bulk validation.
func acquireBulkValidationLock(userID uuid.UUID) bool {
	bulkValidationMutex.Lock()
	defer bulkValidationMutex.Unlock()

	if bulkValidationMap[userID.String()] {
		return false // Already running a batch
	}
	bulkValidationMap[userID.String()] = true
	return true
}

// releaseBulkValidationLock releases the lock for a user after bulk validation.
func releaseBulkValidationLock(userID uuid.UUID) {
	bulkValidationMutex.Lock()
	defer bulkValidationMutex.Unlock()
	delete(bulkValidationMap, userID.String())
}

// SingleValidationRateLimit limits single validation requests based on origin.
func SingleValidationRateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if GetOriginFromRequest(r) == config.FrontendURL {
			limitByIP(w, r, next)
		} else {
			limitByUserPlanConcurrencyLimit(w, r, next)
		}
	})
}

// limitByIP limits requests based on the IP rate limit.
func limitByIP(w http.ResponseWriter, r *http.Request, next http.Handler) {
	clientIP := r.RemoteAddr
	if !getIPRateLimit(clientIP) {
		http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
		return
	}
	next.ServeHTTP(w, r)
}

// getIPRateLimit checks and updates rate limits based on IP.
func getIPRateLimit(clientIP string) bool {
	models.RateLimitMutex.Lock()
	defer models.RateLimitMutex.Unlock()

	clientInfo, exists := models.RateLimitClientMap[clientIP]
	if !exists {
		clientInfo = &models.ClientInfo{LastRequestTime: time.Now()}
		models.RateLimitClientMap[clientIP] = clientInfo
		return true
	}

	now := time.Now()
	if now.Sub(clientInfo.LastRequestTime) < time.Hour/10 {
		return false
	}
	clientInfo.LastRequestTime = now
	return true
}

// limitByUserPlanConcurrencyLimit limits requests based on the user's plan concurrency limit.
func limitByUserPlanConcurrencyLimit(w http.ResponseWriter, r *http.Request, next http.Handler) {
	user := GetUserFromRequest(r)

	if isAccountLimitReached(user) {
		http.Error(w, "Maximum parallel validations reached", http.StatusTooManyRequests)
		return
	}
	next.ServeHTTP(w, r)
}

// isAccountLimitReached checks and updates rate limits based on the user's account.
func isAccountLimitReached(user *models.User) bool {
	models.RateLimitMutex.Lock()
	defer models.RateLimitMutex.Unlock()

	clientInfo, exists := models.RateLimitClientMap[user.ID.String()]
	if !exists {
		clientInfo = &models.ClientInfo{}
		models.RateLimitClientMap[user.ID.String()] = clientInfo
	}

	switch user.CurrentPlan.Type {
	case models.FreePlan:
		if clientInfo.ActiveValidations >= 1 {
			return true
		}
	case models.PremiumOrder:
		if clientInfo.ActiveValidations >= 3 {
			return true
		}
	case models.EnterpriseOrder:
		// No limit for enterprise users
		return false
	default:
		return true
	}

	clientInfo.ActiveValidations++
	defer func() { clientInfo.ActiveValidations-- }()
	return false
}

// BaseRateLimit wraps an http.Handler and limits requests based on the base rate limiter
func BaseRateLimit(h http.Handler) http.Handler {
	return RateLimit(h, models.BaseRateLimiter)
}

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

		clientInfo.LastRequestTime = now
		next.ServeHTTP(w, r)
	})
}
