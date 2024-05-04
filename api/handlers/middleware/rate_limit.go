package middleware

import (
	"email-validator/internal/models"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
)

// Global variables
var bulkValidationMutex sync.Mutex
var bulkValidationMap = make(map[string]bool)

// ValidateBulkValidationRateLimit limits simultaneous bulk validation requests per user.
func ValidateBulkValidationRateLimit(next http.Handler) http.Handler {
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

// SingleValidationRateLimit limits single validation requests based on origin.
func SingleValidationRateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if GetUserFromRequest(r) != nil {
			limitByUserPlanConcurrencyLimit(w, r, next)
		} else {
			limitByIP(w, r, next)
		}
	})
}

// limitByIP limits requests based on the IP rate limit.
func limitByIP(w http.ResponseWriter, r *http.Request, next http.Handler) {
	if !validateIPRateLimit(r.RemoteAddr) {
		http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
		return
	}

	next.ServeHTTP(w, r)
}

func validateIPRateLimit(clientIP string) bool {
	models.RateLimitMutex.Lock()
	defer models.RateLimitMutex.Unlock()

	clientInfo, ok := models.RateLimitClientMap[clientIP]
	if !ok {
		clientInfo = &models.ClientInfo{LastRequestTime: time.Time{}}
	}

	now := time.Now()
	if ok && now.Sub(clientInfo.LastRequestTime) < time.Second*30 {
		return false
	}

	clientInfo.LastRequestTime = now
	models.RateLimitClientMap[clientIP] = clientInfo
	return true
}

// isAccountLimitReached checks and updates rate limits based on the user's account.
func isAccountLimitReached(user *models.User) bool {
	models.RateLimitMutex.Lock()
	defer models.RateLimitMutex.Unlock()

	clientInfo, ok := models.RateLimitClientMap[user.ID.String()]
	if !ok {
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
		models.RateLimitMutex.Lock()

		clientIP := r.RemoteAddr
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

// limitByUserPlanConcurrencyLimit limits requests based on the user's plan concurrency limit.
func limitByUserPlanConcurrencyLimit(w http.ResponseWriter, r *http.Request, next http.Handler) {
	user := GetUserFromRequest(r)

	if isAccountLimitReached(user) {
		http.Error(w, "Maximum parallel validations reached", http.StatusTooManyRequests)
		return
	}

	next.ServeHTTP(w, r)
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
