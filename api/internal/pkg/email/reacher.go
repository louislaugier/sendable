package email

import (
	"bytes"
	"email-validator/internal/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func postToReacher(email string) (*models.ReacherResponse, error) {
	req, err := http.Post("http://reacher:8080/v0/check_email", "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`
		{
			"to_email": "%s"
		}
	`, email))))
	if err != nil {
		log.Println("Error requesting reacher:", err)
		return nil, err
	}
	defer req.Body.Close()

	resp := models.ReacherResponse{}
	err = json.NewDecoder(req.Body).Decode(&resp)
	if err != nil {
		log.Println("Error decoding reacher response:", err)
		return nil, err
	}

	return &resp, nil
}
