package file

import (
	"bufio"
	"email-validator/internal/pkg/format"
	"fmt"
	"io"
	"os"
	"strconv"
	"sync"
)

// GetEmailsFromTXT processes and validates text data.
func GetEmailsFromTXT(reader io.Reader) ([]string, error) {
	lines, err := getLinesFromTXT(reader)
	if err != nil {
		return nil, err
	}

	return getEmailsFromLines(lines), nil
}

// getEmailsFromLines divides the lines across goroutines for parallel validation.
func getEmailsFromLines(lines []string) []string {
	threadsCount, err := strconv.Atoi(os.Getenv("THREADS_COUNT"))
	if err != nil || threadsCount < 1 {
		threadsCount = 1 // Default to 1 if conversion fails or THREADS_COUNT is not set
	}

	var wg sync.WaitGroup
	emailChan := make(chan string)
	go func() {
		wg.Wait()
		close(emailChan)
	}()

	// Start a goroutine for each thread.
	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			for j, line := range lines {
				if j%threadsCount == i { // Assign lines based on mod of goroutine index
					if format.IsEmailValid(line) {
						emailChan <- line
					}
				}
			}
		}(i)
	}

	// Collect the emails.
	var emails []string
	for email := range emailChan {
		emails = append(emails, email)
	}

	return emails
}

// getLinesFromTXT reads a TXT file and returns a slice of lines.
func getLinesFromTXT(reader io.Reader) ([]string, error) {
	scanner := bufio.NewScanner(reader)
	var lines []string

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading TXT data: %w", err)
	}

	return lines, nil
}
