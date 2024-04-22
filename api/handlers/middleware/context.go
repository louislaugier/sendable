package middleware

import (
	"context"
	"email-validator/internal/models"
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
func GetUserIDFromRequest(r *http.Request) uuid.UUID {
	userID := GetValueFromContext(r.Context(), userIDKey)
	return userID.(uuid.UUID)
}

// Extracts origin from the request context
func GetOriginFromRequest(r *http.Request) models.ValidationOrigin {
	userID := GetValueFromContext(r.Context(), requestOriginKey)

	return userID.(models.ValidationOrigin)
}
