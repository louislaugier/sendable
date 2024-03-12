package middleware

import (
	"email-validator/internal/pkg/file"
	"net/http"
	"strings"

	"github.com/google/uuid"
)

// DownloadAuth
func DownloadAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ID, err := uuid.Parse(strings.TrimSuffix(r.URL.Path[len("/reports/"):], ".csv"))

		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		token, err := uuid.Parse(r.URL.Query().Get("token"))
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenFromFile, err := file.GetJSONReportToken(ID)

		if err != nil || tokenFromFile == nil || token != *tokenFromFile {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
