package file

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/google/uuid"
)

func CreateJSONReportToken(ID uuid.UUID) (*uuid.UUID, *os.File, error) {
	token := uuid.New()

	file, err := mapToJSONFile(map[string]interface{}{
		"token": token,
	}, fmt.Sprintf("./report_tokens/%s.json", ID))
	if err != nil {
		return nil, nil, err
	}

	return &token, file, nil
}

func GetJSONReportToken(ID uuid.UUID) (*uuid.UUID, error) {
	fileData, err := os.ReadFile(fmt.Sprintf("./report_tokens/%s.json", ID.String()))
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