package middleware

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/utils"
	"log"
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
			limitSingleByUserPlanConcurrencyLimit(w, r, next)
		} else {
			limitSingleByIP(w, r, next)
		}
	})
}

// limitSingleByIP limits single validation requests based on the IP rate limit.
func limitSingleByIP(w http.ResponseWriter, r *http.Request, next http.Handler) {
	IPs := utils.GetIPsFromRequest(r)

	if !validateIPRateLimit(IPs) {
		http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
		return
	}

	next.ServeHTTP(w, r)
}

func validateIPRateLimit(clientIP string) bool {
	models.RateLimitMutex.Lock()
	defer models.RateLimitMutex.Unlock()

	now := time.Now()
	clientInfo, ok := models.RateLimitClientMap[clientIP]
	if !ok {
		// If the client does not exist in the map, create a new entry with the current time
		models.RateLimitClientMap[clientIP] = &models.ClientInfo{
			LastRequestTime: now,
		}
		return true // Allow the request as this is the first one
	}

	// Calculate the time difference since the last request
	if now.Sub(clientInfo.LastRequestTime) < 30*time.Second {
		// If the request is too soon (less than 30 seconds), reject it
		return false
	}

	// If the time difference is sufficient, update the last request time and allow the request
	clientInfo.LastRequestTime = now
	return true
}

// isAccountConcurrencyLimitReached checks and updates rate limits based on the user's account.
func isAccountConcurrencyLimitReached(user *models.User) bool {
	models.RateLimitMutex.Lock()
	defer models.RateLimitMutex.Unlock()

	clientInfo, ok := models.RateLimitClientMap[user.ID.String()]
	if !ok {
		log.Println("new")
		clientInfo = &models.ClientInfo{}
		models.RateLimitClientMap[user.ID.String()] = clientInfo
	}
	log.Println("not new")

	switch user.CurrentPlan.Type {
	case models.FreePlan:
		if clientInfo.ActiveValidations >= 1 {
			return true
		}
		clientInfo.ActiveValidations++
	case models.PremiumOrder:
		if clientInfo.ActiveValidations >= 3 {
			return true
		}
		clientInfo.ActiveValidations++
	case models.EnterpriseOrder:
		// No limit for enterprise users
		return false
	default:
		return true
	}

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

// limitSingleByUserPlanConcurrencyLimit limits single validation requests based on the user's plan concurrency limit.
func limitSingleByUserPlanConcurrencyLimit(w http.ResponseWriter, r *http.Request, next http.Handler) {
	user := GetUserFromRequest(r)

	if isAccountConcurrencyLimitReached(user) {
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
