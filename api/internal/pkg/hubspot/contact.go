package hubspot

import (
	"sendable/internal/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func GetContacts(accessToken string) ([]models.HubspotContact, error) {
	request, err := http.NewRequest("GET", "https://api.hubapi.com/crm/v3/objects/contacts", nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body) // Read the body once and use respBody for logging and unmarshaling
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HubSpot API responded with status code: %d", resp.StatusCode)
	}

	var contactsInfo models.HubspotContactsResponse
	err = json.Unmarshal(respBody, &contactsInfo) // Use respBody here
	if err != nil {
		return nil, err
	}

	return contactsInfo.Results, nil
}
