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

// ValidatorRateLimiter sets the rate limit to 1 request every 3 seconds
var ValidatorRateLimiter = RateLimiter{
	Limit: time.Second * 3,
}

type ClientInfo struct {
	LastRequestTime time.Time
	Lock            sync.Mutex
}

var (
	RateLimitClientMap = make(map[string]*ClientInfo)
	RateLimitMutex     sync.Mutex
)
