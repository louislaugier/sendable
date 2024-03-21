package salesforce

import (
	"email-validator/config"
	"email-validator/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

func FetchContacts(accessToken string) ([]models.SalesforceContact, error) {
	contactsURL := fmt.Sprintf("%s/services/data/v51.0/query/", config.SalesforceAppURL)

	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s?q=%s", contactsURL, url.QueryEscape("SELECT Id, LastName, FirstName, Email, Phone FROM Contact")), nil)
	if err != nil {
		return nil, fmt.Errorf("salesforce.FetchContacts() failed to create request: %v", err)
	}
	req.Header.Add("Authorization", "Bearer "+accessToken)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("salesforce.FetchContacts() failed to execute request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("salesforce.FetchContacts() returned non-OK status code: %d", resp.StatusCode)
	}

	contactsReponse := models.SalesforceContactsResponse{}
	err = json.NewDecoder(resp.Body).Decode(&contactsReponse)
	if err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	return contactsReponse.Records, nil
}
