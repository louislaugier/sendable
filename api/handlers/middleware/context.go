package middleware

import (
	"context"
	"email-validator/internal/models"
	"net/http"
)

// GetValueFromContext retrieves the value from the context by a key name.
func GetValueFromContext(ctx context.Context, key userContextKey) interface{} {
	return ctx.Value(key)
}

// Extracts user from the request context
func GetUserFromRequest(r *http.Request) *models.User {
	user := GetValueFromContext(r.Context(), userKey)

	if user == nil {
		return nil
	}

	return user.(*models.User)
}

// Extracts origin from the request context
func GetOriginFromRequest(r *http.Request) string {
	origin := GetValueFromContext(r.Context(), requestOriginKey)

	return origin.(string)
}
