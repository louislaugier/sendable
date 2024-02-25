package validate

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
)

func ValidateEmailAddress(email string) error {
	r, err := http.Post(fmt.Sprintf(`%s/v0/check_email`, os.Getenv("VALIDATOR_BASE_URL")), "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`
		{
			"to_email": "%s",
    		"from_email": "hello@tweeter-id.com",
    		"hello_name": "mail.tweeter-id.com"
		}
	`, email))))
	if err != nil {
		log.Println("Error requesting API:", err)
		return err
	}
	defer r.Body.Close()

	responseMap := map[string]interface{}{}
	err = json.NewDecoder(r.Body).Decode(&responseMap)
	if err != nil {
		log.Println("Error decoding API response:", err)
		return err
	}

	mx, ok := responseMap["mx"]
	if !ok {
		return errors.New("'mx' field not present in API response")
	}

	_, ok = mx.(map[string]interface{})["accepts_mail"]
	if !ok {
		return errors.New("mx not accepting emails")
	}

	isReachable, ok := responseMap["is_reachable"]
	if !ok {
		return errors.New("'is_reachable' field not present in API response")
	}

	if isReachable == "safe" || isReachable == "risky" {
		return nil
	}

	return errors.New("bad reachability")
}
