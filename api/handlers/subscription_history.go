package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/pkg/subscription"
	"encoding/json"
	"net/http"
	"strconv"
)

func SubscriptionHistoryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	limit, offset := 10, 0
	var err error
	if r.URL.Query().Get("limit") != "" {
		limit, err = strconv.Atoi(r.URL.Query().Get("limit"))
		if err != nil {
			handleError(w, err, "Invalid query params", http.StatusBadRequest)
			return
		}
	}
	if r.URL.Query().Get("offset") != "" {
		offset, err = strconv.Atoi(r.URL.Query().Get("offset"))
		if err != nil {
			handleError(w, err, "Invalid query params", http.StatusBadRequest)
			return
		}
	}

	userID := middleware.GetUserFromRequest(r).ID
	history, err := subscription.GetMany(userID, limit, offset)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	totalCount, err := subscription.GetCount(userID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"subscriptions": history,
		"count":         totalCount,
	})
}
