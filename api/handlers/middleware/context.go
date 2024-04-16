package middleware

import "context"

// GetValueFromContext retrieves the value from the context by a key name.
func GetValueFromContext(ctx context.Context, key userContextKey) string {
	if key, ok := ctx.Value(key).(string); ok {
		return key
	}

	return ""
}
