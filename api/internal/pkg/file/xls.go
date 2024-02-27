package file

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"

	"github.com/tealeg/xlsx"
)

// GetEmailsFromXLSX processes and validates XLSX data.
func GetEmailsFromXLSX(reader io.Reader) ([]string, error) {
	// For the xlsx package to work, we need to have the data in a file due to its internals requiring `io.ReaderAt`
	// Since this is a limitation, you'd need to write the data to a temporary file if it's coming from an `io.Reader`.
	tempFile, err := ioutil.TempFile("", "email-validator-*.xlsx")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tempFile.Name()) // Clean up the file afterwards

	_, err = io.Copy(tempFile, reader)
	if err != nil {
		return nil, fmt.Errorf("failed to copy to temp file: %w", err)
	}

	if err := tempFile.Close(); err != nil {
		return nil, fmt.Errorf("failed to close temp file: %w", err)
	}

	xlFile, err := xlsx.OpenFile(tempFile.Name())
	if err != nil {
		return nil, fmt.Errorf("failed to open xlsx: %w", err)
	}

	var emails []string
	for _, sheet := range xlFile.Sheets {
		for _, row := range sheet.Rows {
			for _, cell := range row.Cells {
				emails = append(emails, cell.String())
			}
		}
	}

	return emails, nil
}
