package validate

import (
	"bytes"
	"email-validator/internal/pkg/format"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	h "email-validator/internal/pkg/host"
)

func split(email string) (account, host string) {
	i := strings.LastIndexByte(email, '@')
	if i < 0 {
		return
	}
	account = email[:i]
	host = email[i+1:]
	return
}

// Don't use raw with a dirty IP
func ValidateEmailAddress(email string) error {
	_, host := split(email)

	if err := format.ValidateFormat(email); err != nil {
		return err
	}

	client, err := h.ValidateHostMXAndDialServerWithProxy(host)
	if err != nil {
		return err
	}
	defer client.Close()

	err = client.Hello("mail.example.com")
	if err != nil {
		return err
	}

	// err = client.Mail(email)
	// if err != nil {
	// 	return err
	// }

	err = client.Rcpt(email)
	if err != nil {
		return err
	}

	// w, err := client.Data()
	// if err != nil {
	// 	return err
	// }

	// ID := uuid.New()
	// message := []byte(
	// 	fmt.Sprintf(("From: Your Name <your_email@example.com>\r\n" +
	// 		"To: Recipient <%s>\r\n" +
	// 		"Subject: A subject\r\n" +
	// 		"Message-ID: <%s>\r\n" +
	// 		"\r\n"), email, ID),
	// )

	// _, err = w.Write(message)
	// if err != nil {
	// 	return err
	// }

	// w.Close()

	return nil
}

func ValidateEmailAddressFromAPI(email string) error {
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
