package middleware

import (
	"email-validator/config"
	"email-validator/internal/pkg/file"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
)

func ValidateReportToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ID, err := uuid.Parse(strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, fmt.Sprintf("%s/reports/", config.APIVersionPrefix)), ".csv.zip"))
		if err != nil {
			log.Printf("Error parsing report ID from URL: %v", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		token, err := uuid.Parse(r.URL.Query().Get("token"))
		if err != nil {
			log.Printf("Error parsing report token from URL: %v", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenFromFile, err := file.GetJSONReportToken(ID)
		if err != nil || tokenFromFile == nil {
			log.Printf("Error fetching report token from file: %v", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if token != *tokenFromFile {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
