package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"sendable/config"
	"sendable/handlers/middleware"
	"sendable/internal/models"
	"sendable/internal/pkg/email"
	"sendable/internal/pkg/utils"
	"sendable/internal/pkg/validation"

	"github.com/google/uuid"
)

// insert single validation in db with origin (consumer app or api)
func ValidateEmailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	u := middleware.GetUserFromRequest(r)
	if u != nil {
		defer func() { middleware.RateLimitClientMap[u.ID.String()].ActiveValidations-- }()
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
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	requestOrigin := middleware.GetOriginFromRequest(r)

	// Extract provider from query parameters
	provider := r.URL.Query().Get("provider")
	var providerType *models.ContactProviderType
	if provider != "" && requestOrigin == config.FrontendURL {
		pt := models.ContactProviderType(provider)
		providerType = &pt
	}

	v := &models.Validation{
		ID:                       uuid.New(),
		SingleTargetEmail:        req.Email,
		Origin:                   middleware.GetValidationOriginType(requestOrigin),
		Status:                   models.StatusCompleted,
		SingleTargetReachability: &resp.Reachability,
		ProviderSource:           providerType, // Add provider to the validation record
	}

	IPaddresses, userAgent := utils.GetIPsFromRequest(r), r.UserAgent()

	loggedUser := middleware.GetUserFromRequest(r)
	if loggedUser != nil {
		v.UserID = &loggedUser.ID
	} else {
		v.GuestIP = &IPaddresses
		v.GuestUserAgent = &userAgent
	}

	if err := validation.InsertNew(v); err != nil {
		handleError(w, err, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(resp)
}
