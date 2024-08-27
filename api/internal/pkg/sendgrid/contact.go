package sendgrid

import (
	"compress/gzip"
	"email-validator/internal/models"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/sendgrid/rest"
)

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
			"list_ids": [],
			"contact_sample": false
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
			log.Println(url)
			break
		}

		fmt.Println("SendGrid export in progress, checking again...")
		time.Sleep(10 * time.Second) // Add a delay to avoid rapid polling
	}

	log.Println("ok")

	// Step 3: Download the Exported Data
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to download exported data: %w", err)
	}
	defer resp.Body.Close()

	var reader io.Reader = resp.Body

	// Check if the response is compressed
	if resp.Header.Get("Content-Encoding") == "gzip" {
		reader, err = gzip.NewReader(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to create gzip reader: %w", err)
		}
		defer reader.(*gzip.Reader).Close()
	}

	// Step 4: Read CSV Data
	csvReader := csv.NewReader(reader)
	csvReader.FieldsPerRecord = -1 // Allow variable number of fields per record
	csvReader.Comma = ','

	var contacts []models.SendgridContact

	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Println(err)
			return nil, fmt.Errorf("error reading CSV data: %w", err)
		}

		log.Println(record)

		// Assuming models.SendgridContact has fields matching the CSV columns
		contact := models.SendgridContact{
			Email: record[0],
		}
		contacts = append(contacts, contact)
	}

	return contacts, nil
}

func GetContactsCount(client *Client) (int, error) {

	return 0, nil
}
