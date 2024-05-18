package handlers

import (
	"email-validator/handlers/middleware"
	"encoding/json"
	"net/http"
)

func meHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	u := middleware.GetUserFromRequest(r)
	if u != nil {
		json.NewEncoder(w).Encode(u)
	}

	http.Error(w, "Internal Server Error", http.StatusInternalServerError)
}
