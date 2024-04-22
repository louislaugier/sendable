package models

import (
	"sync"
	"time"
)

// RateLimiter defines the rate limit for each client
type RateLimiter struct {
	Limit time.Duration
}

// BaseRateLimiter sets the rate limit to 1 request per second
var BaseRateLimiter = RateLimiter{
	Limit: time.Second,
}

type ClientInfo struct {
	LastRequestTime   time.Time
	Lock              sync.Mutex
	ActiveValidations int
}

var (
	RateLimitClientMap = make(map[string]*ClientInfo)
	RateLimitMutex     sync.Mutex
)
