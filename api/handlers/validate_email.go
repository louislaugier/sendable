package handlers

import (
	"email-validator/handlers/middleware"
	"email-validator/internal/models"
	"email-validator/internal/pkg/email"
	"email-validator/internal/pkg/user"
	"email-validator/internal/pkg/utils"
	"email-validator/internal/pkg/validation"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/google/uuid"
)

// insert single validation in db with origin (consumer app or api)
func validateEmailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	u := middleware.GetUserFromRequest(r)
	if u != nil {
		defer func() { models.RateLimitClientMap[u.ID.String()].ActiveValidations-- }()
	}

	req := models.ValidateEmailRequest{}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		handleError(w, err, "invalid payload", http.StatusInternalServerError)
		return
	}

	if req.Email == nil {
		http.Error(w, "invalid payload: missing email field in JSON body", http.StatusBadRequest)
		return
	}

	resp, err := email.Validate(*req.Email)
	if err != nil {
		if errors.Is(err, models.ErrInvalidEmail) {
			http.Error(w, models.ErrInvalidEmail.Error(), http.StatusBadRequest)
			return
		}

		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	v := &models.Validation{
		ID:                       uuid.New(),
		SingleTargetEmail:        req.Email,
		Origin:                   middleware.GetValidationOriginType(middleware.GetOriginFromRequest(r)),
		Status:                   models.StatusCompleted,
		SingleTargetReachability: &resp.Reachability,
	}

	IPaddresses, userAgent := utils.GetIPsFromRequest(r), r.UserAgent()

	loggedUser := middleware.GetUserFromRequest(r)
	if loggedUser != nil {
		v.UserID = &loggedUser.ID

		err = user.UpdateIPsAndUserAgent(*v.UserID, IPaddresses, userAgent)
		if err != nil {
			handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	} else {
		v.GuestIP = &IPaddresses
		v.GuestUserAgent = &userAgent
	}

	if err := validation.InsertNew(v); err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
	}

	json.NewEncoder(w).Encode(resp)
}
