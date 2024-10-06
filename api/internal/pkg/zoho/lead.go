package zoho

import (
	"sendable/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func GetLeads(accessToken string) ([]models.ZohoLead, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://www.zohoapis.com/crm/v2/Leads", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Zoho-oauthtoken %s", accessToken))

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var result models.ZohoLeadsResponse

	json.NewDecoder(resp.Body).Decode(&result)

	return result.Data, nil
}
