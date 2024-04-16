package handlers

import (
	"net/http"
)

// We can get organization info via oauth but no info on the user logging in, therefore we need to ask the user who he is in a given organization after the oauth flow and then send him a confirmation email
func zohoAuthConfirmEmailHandler(w http.ResponseWriter, r *http.Request) {
	// body := models.ZohoAuthRequest{}

	// if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
	// 	log.Printf("ZohoAuthHandler: Error decoding JSON: %v", err)
	// 	http.Error(w, "Error decoding JSON", http.StatusBadRequest)
	// 	return
	// }

	// if body.Code == "" {
	// 	http.Error(w, "Missing code", http.StatusBadRequest)
	// 	return
	// }

}
