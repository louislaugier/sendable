package handlers

import (
	"net/http"
)

func confirmEmailHandler(w http.ResponseWriter, r *http.Request) {
	// get email & code from req body
	// get user from db by email & code
	// if match
	// set account as confirmed in db
	//	redirect to frontend /dashboard
}
