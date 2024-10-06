package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sendable/config"
	"sendable/internal/models"
	"strings"
)

func postToReacher(email string) (*models.ReacherResponse, error) {
	log.Printf("Validating %s", email)
	req, err := http.Post("http://reacher:8080/v0/check_email", "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`
		{
			"to_email": "%s",
			"hello_name": "%s"
		}
	`, email, strings.TrimPrefix(strings.TrimPrefix(config.BaseURL, "http://"), "https://")))))
	if err != nil {
		return nil, err
	}
	defer req.Body.Close()

	resp := models.ReacherResponse{}
	err = json.NewDecoder(req.Body).Decode(&resp)
	if err != nil {
		return nil, err
	}

	return &resp, nil
}

func postBulkToReacher(email string) ([]models.ReacherResponse, error) {

	return nil, nil
}

func NewInvalidFormatReacherResponse(email string) models.ReacherResponse {
	return models.ReacherResponse{
		Input:        email,
		Reachability: models.ReachabilityInvalid,
		Syntax: models.Syntax{
			IsValidSyntax: false,
		},
	}
}
