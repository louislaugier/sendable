package file

import (
	"bufio"
	"sendable/internal/pkg/format"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"sync"
)

// GetEmailsFromTXT now accepts a multipart.File and returns a slice of valid emails.
func GetEmailsFromTXT(file multipart.File) ([]string, error) {
	lines, err := getLinesFromTXT(file)
	if err != nil {
		return nil, err
	}

	return getEmailsFromLines(lines), nil
}

// getEmailsFromLines occupies multiple worker goroutines to validate emails in parallel.
func getEmailsFromLines(lines []string) []string {
	threadsCount, err := strconv.Atoi(os.Getenv("THREADS_COUNT"))
	if err != nil || threadsCount < 1 {
		threadsCount = 1 // Fall back to single-thread if THREADS_COUNT is invalid or not set.
	}

	var wg sync.WaitGroup
	emailChan := make(chan string)
	go func() {
		wg.Wait()
		close(emailChan)
	}()

	// Distribute the work between goroutines.
	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			for j, line := range lines {
				if j%threadsCount == i { // Split the work using modular division
					if format.IsEmailValid(line) {
						emailChan <- line
					}
				}
			}
		}(i)
	}

	// Collect the emails from the channel.
	var emails []string
	for email := range emailChan {
		emails = append(emails, email)
	}

	return emails
}

// getLinesFromTXT is modified to accept a multipart.File and read lines to return a slice of strings.
func getLinesFromTXT(file multipart.File) ([]string, error) {
	// Make sure we are reading from the start of the file
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return nil, fmt.Errorf("error seeking file: %w", err)
	}

	scanner := bufio.NewScanner(file)
	var lines []string

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading TXT data: %w", err)
	}

	return lines, nil
}
