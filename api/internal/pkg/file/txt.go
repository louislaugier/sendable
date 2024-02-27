package file

import (
	"bufio"
	"fmt"
	"io"
)

// GetEmailsFromTXT processes and validates text data.
func GetEmailsFromTXT(reader io.Reader) ([]string, error) {
	scanner := bufio.NewScanner(reader)
	var emails []string

	for scanner.Scan() {
		emails = append(emails, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading TXT data: %w", err)
	}

	return emails, nil
}
