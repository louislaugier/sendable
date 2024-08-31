package sendgrid

import (
	"compress/gzip"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"email-validator/internal/models"

	"github.com/sendgrid/rest"
)

// TODO: listIDs & segmentIDs
func GetContacts(client *Client) ([]models.SendgridContact, error) {
	// Construct the full URL
	fullURL := "https://api.sendgrid.com/v3/marketing/contacts/exports"

	request := rest.Request{
		Method:  rest.Post,
		BaseURL: fullURL,
		Headers: map[string]string{
			"Authorization": "Bearer " + client.APIKey,
			"Content-Type":  "application/json",
		},
		Body: []byte(`{
			"file_type": "json"
		}`),
	}

	response, err := rest.Send(request)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}

	if response.StatusCode != http.StatusAccepted {
		return nil, fmt.Errorf("failed to initiate export: %s", response.Body)
	}

	var exportResponse map[string]interface{}
	if err := json.Unmarshal([]byte(response.Body), &exportResponse); err != nil {
		return nil, fmt.Errorf("failed to parse export response: %w", err)
	}

	exportID := exportResponse["id"].(string)

	// Step 2: Check Export Status and Retrieve Data
	exportURL := fmt.Sprintf("https://api.sendgrid.com/v3/marketing/contacts/exports/%s", exportID)
	var url string
	for {
		request = rest.Request{
			Method:  rest.Get,
			BaseURL: exportURL,
			Headers: map[string]string{
				"Authorization": "Bearer " + client.APIKey,
			},
		}

		response, err = rest.Send(request)
		if err != nil {
			return nil, fmt.Errorf("failed to send request: %w", err)
		}

		if response.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("failed to get export status: %s", response.Body)
		}

		var statusResponse map[string]interface{}
		if err := json.Unmarshal([]byte(response.Body), &statusResponse); err != nil {
			return nil, fmt.Errorf("failed to parse status response: %w", err)
		}

		status := statusResponse["status"].(string)
		if status == "ready" {
			fmt.Println("SendGrid export completed.")
			url = statusResponse["urls"].([]interface{})[0].(string)
			break
		}

		time.Sleep(3 * time.Second) // Add a delay to avoid rapid polling
	}

	// Step 3: Download the Exported Data
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to download exported data: %w", err)
	}
	defer resp.Body.Close()

	// Check if the response is gzipped and decompress it
	var reader io.Reader
	if resp.Header.Get("Content-Encoding") == "x-gzip" {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to create gzip reader: %w", err)
		}
		defer gzipReader.Close()
		reader = gzipReader
	} else {
		reader = resp.Body
	}

	// Read the response body
	bodyBytes, err := io.ReadAll(reader)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Split the response body into separate JSON objects
	parts := strings.Split(string(bodyBytes), "}\n{")
	var contacts []models.SendgridContact

	for i, part := range parts {
		if i > 0 {
			// Add back the removed curly braces between parts
			part = "{" + part
		}
		if i < len(parts)-1 {
			part = part + "}"
		}

		var result map[string]interface{}
		err = json.Unmarshal([]byte(part), &result)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON part: %w", err)
		}

		if email, ok := result["email"]; ok {
			if emailStr, ok := email.(string); ok {
				contacts = append(contacts, models.SendgridContact{
					Email: emailStr,
				})
			}
		}
	}

	// Return the contacts (currently empty, you'll need to populate this from result)
	return contacts, nil
}

func GetContactsCount(client *Client) (int, error) {
	// Construct the URL for retrieving contacts count
	fullURL := "https://api.sendgrid.com/v3/marketing/contacts/count"

	// Create a new request to SendGrid API
	request := rest.Request{
		Method:  rest.Get,
		BaseURL: fullURL,
		Headers: map[string]string{
			"Authorization": "Bearer " + client.APIKey,
		},
	}

	// Send the request to the API
	response, err := rest.Send(request)
	if err != nil {
		return 0, fmt.Errorf("failed to send request: %w", err)
	}

	// Check for a successful response status
	if response.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("failed to retrieve contacts count: %s", response.Body)
	}

	// Parse the response body to extract the contact count
	var resp map[string]interface{}
	if err := json.Unmarshal([]byte(response.Body), &resp); err != nil {
		return 0, fmt.Errorf("failed to parse response: %w", err)
	}

	countResponse, ok := resp["contact_count"]
	if !ok {
		return 0, errors.New("failed to parse response, no contact_count field")
	}

	count, ok := countResponse.(float64)
	if !ok {
		return 0, errors.New("failed to parse response, contact_count is not a float64")
	}

	return int(count), nil
}
