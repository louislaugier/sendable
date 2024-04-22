package middleware

import (
	"context"
	"net/http"

	"github.com/google/uuid"
)

// GetValueFromContext retrieves the value from the context by a key name.
func GetValueFromContext(ctx context.Context, key userContextKey) interface{} {
	if key, ok := ctx.Value(key).(string); ok {
		return key
	}

	return ""
}

// Extracts userID from the request context
func getUserIDFromRequest(r *http.Request) uuid.UUID {
	userID := GetValueFromContext(r.Context(), userIDKey)
	return userID.(uuid.UUID)
}
