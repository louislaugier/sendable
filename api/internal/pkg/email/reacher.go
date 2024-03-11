package email

import (
	"bytes"
	"email-validator/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func postToReacher(email string) (*models.ReacherResponse, error) {
	req, err := http.Post("http://reacher:8080/v0/check_email", "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`
		{
			"to_email": "%s"
		}
	`, email))))
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
