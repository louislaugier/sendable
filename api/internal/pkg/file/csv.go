package file

import (
	"encoding/csv"
	"io"
	"log"
)

// GetEmailsFromCSV processes and validates CSV data.
func GetEmailsFromCSV(reader io.Reader, comma rune) ([]string, error) {
	csvReader := csv.NewReader(reader)
	csvReader.Comma = comma // Set the CSV delimiter as specified
	var emails []string

	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error reading CSV: %v\n", err)
			continue
		}
		emails = append(emails, record...)
	}

	return emails, nil
}
