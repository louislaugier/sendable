package validate

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
)

func ValidateEmailAddress(email string) error {
	r, err := http.Post("http://localhost:8080/v0/check_email", "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`
		{
			"to_email": "%s"
		}
	`, email))))
	if err != nil {
		log.Println("error requesting local reacher:", err)
		return err
	}
	defer r.Body.Close()

	responseMap := map[string]interface{}{}
	err = json.NewDecoder(r.Body).Decode(&responseMap)
	if err != nil {
		log.Println("error decoding response:", err)
		return err
	}

	mx, ok := responseMap["mx"]
	if !ok {
		return errors.New("mx field not present in response")
	}

	_, ok = mx.(map[string]interface{})["accepts_mail"]
	if !ok {
		return errors.New("domain not accepting emails")
	}

	isReachable, ok := responseMap["is_reachable"]
	if !ok {
		return errors.New("is_reachable not present in response")
	}

	if isReachable == "safe" || isReachable == "risky" {
		return nil
	}

	return errors.New("bad reachability")
}
