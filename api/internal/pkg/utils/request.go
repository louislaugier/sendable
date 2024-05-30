package utils

import (
	"net/http"
	"strings"
)

func IsMultipartFormContentType(r *http.Request) bool {
	return strings.Contains(r.Header.Get("Content-Type"), "multipart/form-data")
}
