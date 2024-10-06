package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/contact_provider"
	"encoding/json"
	"fmt"
	"net/http"
)

func DeleteProviderAPIKeyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	req := models.DeleteProviderAPIKeyRequest{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		handleError(w, err, "invalid payload", http.StatusInternalServerError)
		return
	}

	provider := req.Provider
	if provider == "" {
		http.Error(w, "invalid payload: missing provider JSON body", http.StatusBadRequest)
		return
	}
	err := contact_provider.Delete(middleware.GetUserFromRequest(r).ID, models.ContactProviderType(provider))
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
