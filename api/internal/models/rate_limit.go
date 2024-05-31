package models

import (
	"sync"
	"time"
)

// RateLimiter defines the rate limit for each client
type (
	RateLimiter struct {
		Limit time.Duration
	}
	ClientInfo struct {
		LastRequestTime   time.Time
		Lock              sync.Mutex
		ActiveValidations int
	}
)
