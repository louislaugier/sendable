package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/pkg/user"
	"fmt"
	"net/http"
)

func Disable2FAHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	u := middleware.GetUserFromRequest(r)
	err := user.Set2FASecret(u.ID, nil)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
