package mailchimp

import (
	"email-validator/internal/models"
	"email-validator/internal/pkg/oauth"
	"encoding/json"
	"fmt"
	"net/http"
)

func GetContacts(accessToken string, accountBaseURL *string) ([]models.MailchimpContact, error) {
	if accountBaseURL == nil {
		_, userInfo, err := oauth.VerifyMailchimpCode(accessToken)
		if err != nil {
			return nil, err
		}

		accountBaseURL = &userInfo.APIEndpoint
	}

	var contacts []models.MailchimpContact

	// Get all lists
	listURL := fmt.Sprintf("%s/3.0/lists", *accountBaseURL)
	listReq, err := http.NewRequest("GET", listURL, nil)
	if err != nil {
		return nil, err
	}
	listReq.Header.Add("Authorization", "Bearer "+accessToken)

	listResp, err := http.DefaultClient.Do(listReq)
	if err != nil {
		return nil, err
	}
	defer listResp.Body.Close()

	lists := models.ListResponse{}
	err = json.NewDecoder(listResp.Body).Decode(&lists)
	if err != nil {
		return nil, err
	}

	// Get contacts from each list
	for _, list := range lists.Lists {
		url := fmt.Sprintf("%s/3.0/lists/%s/members", *accountBaseURL, list.ID)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, err
		}
		req.Header.Add("Authorization", "Bearer "+accessToken)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		contactResponse := models.MailchimpContactResponse{}
		err = json.NewDecoder(resp.Body).Decode(&contactResponse)
		if err != nil {
			return nil, err
		}

		contacts = append(contacts, contactResponse.Members...)
	}

	return contacts, nil
}
