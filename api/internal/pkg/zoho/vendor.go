package zoho

import (
	"sendable/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func GetVendors(accessToken string) ([]models.ZohoVendor, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://www.zohoapis.com/crm/v2/Vendors", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Zoho-oauthtoken %s", accessToken))

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var result models.ZohoVendorsResponse

	json.NewDecoder(resp.Body).Decode(&result)

	return result.Data, nil
}
