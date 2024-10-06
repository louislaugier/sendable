package handlers

import (
	"sendable/handlers/middleware"
	"sendable/internal/pkg/user"
	"fmt"
	"net/http"
)

func DeleteAccountHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	u := middleware.GetUserFromRequest(r)
	err := user.Delete(u.ID)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}
