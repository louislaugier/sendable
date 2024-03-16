package format

// ColorizeRequestLog returns the ANSI escape code for the color based on the HTTP status code.
func ColorizeRequestLog(status int) string {
	switch {
	case status >= 200 && status < 300:
		return "\x1b[32m" // Green for 2xx
	case status >= 300 && status < 400:
		return "\x1b[36m" // Cyan for 3xx
	case status >= 400 && status < 500:
		return "\x1b[33m" // Yellow for 4xx
	case status >= 500:
		return "\x1b[31m" // Red for 5xx
	default:
		return "\x1b[0m" // Default color
	}
}
