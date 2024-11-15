package middleware

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"sendable/config"
	"sendable/internal/models"
	"sendable/internal/pkg/stripe"
	"sendable/internal/pkg/user"
	"sendable/internal/pkg/utils"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// CustomClaims includes the custom claims for the JWT.
type CustomClaims struct {
	UserID    uuid.UUID `json:"user_id"`
	UserEmail string    `json:"user_email"`
	jwt.StandardClaims
}

type contextKey string

const userKey contextKey = "user"
const userContactProvidersKey contextKey = "user_contact_providers" // contact_providers

const fileDataKey contextKey = "file_data"

// GenerateAndBindJWT generates a new JWT token and adds it to the User pointer.
// it also creates an API key linked to the user
// the API key can be used to generate a JWT
func GenerateAndBindJWT(user *models.User) error {
	jwt, err := GenerateJWT(user.ID, user.Email)
	if err != nil {
		return err
	} else if jwt == nil {
		return errors.New("empty jwt after errorless generation")
	}

	user.JWT = *jwt
	return nil
}

// GenerateJWT generates a new JWT token for the user.
func GenerateJWT(userID uuid.UUID, userEmail string) (*string, error) {
	now := time.Now()

	claims := CustomClaims{
		UserID:    userID,
		UserEmail: userEmail,
		StandardClaims: jwt.StandardClaims{
			Issuer:    config.BaseURL,
			Subject:   userID.String(),
			ExpiresAt: now.AddDate(0, 0, 30).Unix(),
			IssuedAt:  now.Unix(),
			Audience:  config.FrontendURL,
			Id:        uuid.New().String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(getJWTSecret()))

	if err != nil {
		log.Printf("Error creating JWT: %v", err)
		return nil, err
	}

	return &signedToken, nil
}

// ValidateJWT middleware validates the JWT token in the request header.
func ValidateJWT(next http.Handler, requiresConfirmedEmail bool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := ExtractToken(r)
		if tokenString == "" {
			http.Error(w, "Missing or Invalid Authorization Header", http.StatusUnauthorized)
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(getJWTSecret()), nil
		})

		if err != nil {
			log.Printf("Error parsing JWT: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
			userID := claims.UserID

			u, err := user.GetByID(userID)
			if err != nil || u == nil {
				log.Printf("Error fetching user: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			} else if !u.IsEmailConfirmed && requiresConfirmedEmail {
				http.Error(w, "Email address is not confirmed", http.StatusBadRequest)
				return
			}

			hasOngoingPlan := u.CurrentPlan.Type != models.FreePlan

			if hasOngoingPlan && u.DeletedAt != nil {
				err := user.Reactivate(userID)
				if err != nil {
					log.Printf("Error reactivating user: %v", err)
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}
			}

			if u.StripeCustomerID != nil && hasOngoingPlan {
				s, err := stripe.CreateCustomerPortalSession(*u.StripeCustomerID)
				if err != nil {
					log.Printf("Error generating Stripe customer portal: %v", err)
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
					return
				}

				u.StripeCustomerPortalURL = &s.URL
			}

			IPaddresses, userAgent := utils.GetIPsFromRequest(r), r.UserAgent()
			err = user.UpdateIPsAndUserAgent(u.ID, IPaddresses, userAgent)
			if err != nil {
				log.Printf("Error updating user's IPs and user agent: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}

			providers := append([]models.ContactProvider(nil), u.ContactProviders...)
			ctx := context.WithValue(r.Context(), userContactProvidersKey, providers)
			for i := range u.ContactProviders {
				l := *u.ContactProviders[i].APIKey
				lastChars := l[len(l)-5:]

				u.ContactProviders[i].APIKey = nil

				u.ContactProviders[i].LastAPIKeyChars = &lastChars
			}

			ctx = context.WithValue(ctx, userKey, u)

			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}
	})
}

// Parses claims from a JWT token.
// This method parses the token but doesn't validate the signature. It's only
// ever useful in cases where you know the signature is valid (because it has
// been checked previously in the stack) and you want to extract values from
// it.
func ParseClaimsFromJWT(tokenString string) (*CustomClaims, error) {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, &CustomClaims{})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok {
		return claims, nil
	}
	return nil, fmt.Errorf("could not parse claims")
}

// ExtractToken extracts the bearer token from the request.
func ExtractToken(r *http.Request) string {
	bearerToken := r.Header.Get("Authorization")
	if bearerToken == "" || !strings.HasPrefix(bearerToken, "Bearer ") {
		return ""
	}
	return strings.TrimPrefix(bearerToken, "Bearer ")
}

// getJWTSecret gets the JWT secret key from the environment.
func getJWTSecret() string {
	return os.Getenv("JWT_SECRET_KEY")
}
