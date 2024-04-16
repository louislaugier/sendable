package middleware

import (
	"context"
	"email-validator/internal/models"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// CustomClaims includes the custom claims for the JWT.
type CustomClaims struct {
	UserID    string `json:"user_id"`
	UserEmail string `json:"user_email"`
	jwt.StandardClaims
}

type userContextKey string

const userKey userContextKey = "user_id"

// GenerateAndBindJWT generates a new JWT token and adds it to the User pointer.
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
	ID := userID.String()

	claims := CustomClaims{
		UserID:    ID,
		UserEmail: userEmail,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "https://sendable.email",
			Subject:   ID,
			ExpiresAt: time.Now().AddDate(0, 0, 30).Unix(),
			IssuedAt:  time.Now().Unix(),
			Audience:  "https://api.sendable.email",
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
func ValidateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := ExtractToken(r)
		if tokenString == "" {
			http.Error(w, "Missing or Invalid Authorization Header", http.StatusUnauthorized)
			return
		}

		// Parse the token with the claims checks the signature as well
		token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(getJWTSecret()), nil
		})

		if err != nil {
			// Token parsing error
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
			// Context is the preferred method for passing values down the request pipeline
			ctx := context.WithValue(r.Context(), userKey, claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			// Token is not valid
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
