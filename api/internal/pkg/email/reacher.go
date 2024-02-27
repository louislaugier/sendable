package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func postToReacher(email string) (map[string]interface{}, error) {
	req, err := http.Post("http://reacher:8080/v0/check_email", "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`
		{
			"to_email": "%s"
		}
	`, email))))
	if err != nil {
		log.Println("error requesting local reacher:", err)
		return nil, err
	}
	defer req.Body.Close()

	resp := map[string]interface{}{}
	err = json.NewDecoder(req.Body).Decode(&resp)
	if err != nil {
		log.Println("error decoding response:", err)
		return nil, err
	}

	return resp, nil
}
