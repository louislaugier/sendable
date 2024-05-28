package file

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/google/uuid"
)

func CreateJSONReportTokenFile(validationID, reportToken uuid.UUID) (*os.File, error) {
	file, err := mapToJSONFile(map[string]interface{}{
		"token": reportToken,
	}, fmt.Sprintf("./files/report_tokens/%s.json", validationID))
	if err != nil {
		return nil, err
	}

	return file, nil
}

func GetJSONReportToken(validationID uuid.UUID) (*uuid.UUID, error) {
	fileData, err := os.ReadFile(fmt.Sprintf("./files/report_tokens/%s.json", validationID.String()))
	if err != nil {
		return nil, err
	}

	var jsonData map[string]interface{}
	if err := json.Unmarshal(fileData, &jsonData); err != nil {
		return nil, err
	}

	token, err := uuid.Parse(jsonData["token"].(string))
	if err != nil {
		return nil, err
	}

	return &token, nil
}

func mapToJSONFile(data map[string]interface{}, filePath string) (*os.File, error) {
	jsonData, err := json.MarshalIndent(data, "", "    ")
	if err != nil {
		return nil, err
	}

	file, err := os.Create(filePath)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			file.Close()
		}
	}()

	_, err = file.Write(jsonData)
	if err != nil {
		return nil, err
	}

	return file, nil
}
