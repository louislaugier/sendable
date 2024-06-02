package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/pkg/user"
	"fmt"
	"net/http"
	"time"
)

func DeleteAccountHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	u := middleware.GetUserFromRequest(r)
	err := user.Delete(u.ID, time.Now())
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
