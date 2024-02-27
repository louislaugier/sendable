package file

import (
	"email-validator/internal/pkg/format"
	"encoding/csv"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
)

func GetEmailsFromCSV(reader io.Reader, comma rune) ([]string, error) {
	lines, err := getLinesFromCSV(reader, comma)
	if err != nil {
		return nil, err
	}

	// Get THREADS_COUNT from the environment and convert it into an integer
	threadsCountEnv := os.Getenv("THREADS_COUNT")
	threadsCount, err := strconv.Atoi(threadsCountEnv)
	if err != nil {
		log.Printf("Invalid THREADS_COUNT value: %v\n", err)
		threadsCount = 1 // Default to 1 if conversion fails or env var is not set
	}

	// Create a slice to store valid emails
	emails := make([]string, 0)

	// Initialize a WaitGroup to wait for all goroutines to finish
	var wg sync.WaitGroup

	// Create a mutex to protect shared resource (the emails slice)
	var mutex sync.Mutex

	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(partitionIndex int) {
			defer wg.Done()
			for j, line := range lines {
				// Each goroutine processes their respective partition of the slice
				if j%threadsCount == partitionIndex {
					for _, cell := range line {
						trimmedCell := strings.TrimSpace(cell)
						if format.IsEmailValid(trimmedCell) {
							mutex.Lock()
							emails = append(emails, trimmedCell)
							mutex.Unlock()
						}
					}
				}
			}
		}(i)
	}

	// Wait for all goroutines to finish
	wg.Wait()

	return emails, nil
}

func getLinesFromCSV(reader io.Reader, comma rune) ([][]string, error) {
	// This remains almost the same because CSV reading is inherently sequential due to the way files are read
	csvReader := csv.NewReader(reader)
	csvReader.Comma = comma

	var lines [][]string
	var wg sync.WaitGroup
	mu := sync.Mutex{}
	errChannel := make(chan error, 1) // Buffered channel for error handling
	closed := false                   // Flag to indicate if the channel is closed

	// Reading the CSV can't be parallelized in this way since it's a sequential operation
	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			// Send the error on the channel and exit the loop
			if !closed {
				errChannel <- err
				closed = true
				close(errChannel)
			}
			break
		}
		mu.Lock()
		lines = append(lines, record)
		mu.Unlock()
	}

	// Check for an error after the loop
	select {
	case err := <-errChannel:
		return nil, err
	default:
	}

	wg.Wait()

	return lines, nil
}
