package middleware

import (
	"net/http"
	"sync"
	"time"
)

// ClientLimit defines the rate limit for each client
const ClientLimit = time.Second * 3 // 1 request every 3 seconds allowed

type ClientInfo struct {
	lastRequestTime time.Time
	lock            sync.Mutex
}

var (
	clientMap = make(map[string]*ClientInfo)
	mutex     sync.Mutex
)

// RateLimit wraps an http.Handler and limits requests based on ClientLimit
func RateLimit(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clientIP := r.RemoteAddr
		mutex.Lock()
		clientInfo, ok := clientMap[clientIP]
		if !ok {
			clientInfo = &ClientInfo{}
			clientMap[clientIP] = clientInfo
		}
		mutex.Unlock()

		clientInfo.lock.Lock()
		defer clientInfo.lock.Unlock()

		now := time.Now()
		elapsed := now.Sub(clientInfo.lastRequestTime)
		if elapsed < ClientLimit {
			time.Sleep(ClientLimit - elapsed)
		}

		clientInfo.lastRequestTime = time.Now()
		h.ServeHTTP(w, r)
	})
}
