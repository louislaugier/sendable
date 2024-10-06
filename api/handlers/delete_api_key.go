package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/api_key"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

func DeleteAPIKeyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.DeleteAPIKeyRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	} else if body.ID == nil {
		err := errors.New("invalid or missing API key ID in body")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	u := middleware.GetUserFromRequest(r)
	err := api_key.Delete(u.ID, *body.ID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
