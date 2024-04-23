package middleware

import (
	"context"
	"email-validator/internal/models"
	"net/http"
)

// GetValueFromContext retrieves the value from the context by a key name.
func GetValueFromContext(ctx context.Context, key userContextKey) interface{} {
	if key, ok := ctx.Value(key).(string); ok {
		return key
	}

	return ""
}

// Extracts user from the request context
func GetUserFromRequest(r *http.Request) *models.User {
	user := GetValueFromContext(r.Context(), userKey)
	return user.(*models.User)
}

// Extracts origin from the request context
func GetOriginFromRequest(r *http.Request) string {
	origin := GetValueFromContext(r.Context(), requestOriginKey)

	return origin.(string)
}
