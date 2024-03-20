package oauth

import (
	"email-validator/internal/models"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func VerifyFacebookAccessToken(accessToken string) (*models.FacebookUser, error) {
	// Define the Graph API endpoint with fields parameter for the email
	apiEndpoint := fmt.Sprintf("https://graph.facebook.com/me?fields=email&access_token=%s", accessToken)

	// Make the HTTP GET request to Facebook Graph API
	response, err := http.Get(apiEndpoint)
	if err != nil {
		return nil, fmt.Errorf("error making request to Facebook Graph API: %v", err)
	}
	defer response.Body.Close()

	// Read the response body
	responseBody, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body from Facebook Graph API: %v", err)
	}

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: got status code %d from Facebook Graph API: %s", response.StatusCode, string(responseBody))
	}

	log.Println(string(responseBody))

	// Unmarshal the JSON data into the FacebookUser struct
	user := models.FacebookUser{}
	if err := json.Unmarshal(responseBody, &user); err != nil {
		return nil, fmt.Errorf("error unmarshalling response JSON: %v", err)
	}
	log.Println(user)

	return &user, nil
}
