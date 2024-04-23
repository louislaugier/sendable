package handlers

import (
	"net/http"
)

// We can get organization info via oauth but no info on the user logging in, therefore we need to ask the user who he is in a given organization after the oauth flow and then send him a confirmation email
func zohoAuthSetEmailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	// userID := middleware.GetUserIDFromRequest(r)

	// user, err :=
	// get user by id
	// send email to req body email with user.email_confirmation_code
}
