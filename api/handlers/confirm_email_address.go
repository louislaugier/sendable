package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sendable/config"
	"sendable/handlers/middleware"
	"sendable/internal/pkg/user"
	"strconv"
)

// ConfirmEmailAddressHandler is called directly from transactional emails
func ConfirmEmailAddressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := r.URL.Query()
	currentEmail := query.Get("currentEmail")
	email := query.Get("email")
	code := query.Get("code")
	magicLink := query.Get("magicLink")
	isMagicLink := magicLink != ""
	isNewAccount := query.Get("isNewAccount") == "true"
	isZohoConfirmation := query.Get("isZohoConfirmation") == "true"

	if email == "" || code == "" {
		err := errors.New("missing email or confirmation code in query parameters")
		handleError(w, err, err.Error(), http.StatusBadRequest)
		return
	}

	codeInt, err := strconv.Atoi(code)
	if err != nil {
		handleError(w, err, "Invalid confirmation code format", http.StatusBadRequest)
		return
	}

	u, err := user.GetByEmailAndConfirmationCode(currentEmail, codeInt)
	log.Println(u.EmailConfirmationCode)
	if err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	} else if u == nil || *u.EmailConfirmationCode != codeInt {
		handleError(w, err, "Invalid code.", http.StatusUnauthorized)
		return
	}

	if isNewAccount {
		err = user.SetEmailConfirmed(u.ID)
		if err != nil {
			handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	} else {
		err = user.UpdateEmailAddress(u.ID, u.Email)
		if err != nil {
			handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	page := "/dashboard"
	if !isNewAccount && !isZohoConfirmation {
		page = "/settings"
	}
	if isMagicLink {
		// we don't know if user is logged in
		page = "/"
	}

	if magicLink != "" {
		http.Redirect(w, r, fmt.Sprintf("%s%s?email_confirmed=true", config.FrontendURL, page), http.StatusSeeOther)
		return
	}

	if err := middleware.GenerateAndBindJWT(u); err != nil {
		handleError(w, err, "Error generating & binding JWT", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}
