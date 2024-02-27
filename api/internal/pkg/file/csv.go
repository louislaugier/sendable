package file

import (
	"bufio"
	"email-validator/internal/pkg/format"
	"encoding/csv"
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"strings"
	"sync"
)

// GetLinesFromCSV reads a CSV file from a multipart.File and returns the lines.
func GetLinesFromCSV(file multipart.File, comma rune) ([][]string, error) {
	// Reset the internal pointer to the beginning of the file
	_, err := file.Seek(0, io.SeekStart)
	if err != nil {
		return nil, err
	}

	// New CSV reader
	csvReader := csv.NewReader(file)
	csvReader.Comma = comma

	// Read all CSV lines
	return csvReader.ReadAll()
}

// GetEmailsFromCSV accepts a multipart.File, reads the lines of CSV,
// and extracts valid email addresses.
func GetEmailsFromCSV(file multipart.File, comma rune) ([]string, error) {
	// Get lines from the CSV file
	lines, err := GetLinesFromCSV(file, comma)
	if err != nil {
		return nil, err
	}

	threadsCountEnv := os.Getenv("THREADS_COUNT")
	threadsCount, err := strconv.Atoi(threadsCountEnv)
	if err != nil {
		threadsCount = 1 // Default to 1 if conversion fails or env var is not set
	}

	var emails []string
	var wg sync.WaitGroup
	var mutex sync.Mutex

	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(partitionIndex int) {
			defer wg.Done()
			for j, line := range lines {
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

	wg.Wait()

	return emails, nil
}

func CountLinesInCSV(fileHeader *multipart.FileHeader) (int, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	lineCount := 0

	// Count the number of lines
	for scanner.Scan() {
		lineCount++
	}

	if err := scanner.Err(); err != nil {
		return lineCount, err
	}

	return lineCount, nil
}

// guessCSVDelimiter reads a sample of the CSV content from a multipart file
// and guesses the delimiter based on the content.
func GuessCSVDelimiter(fh *multipart.FileHeader) (rune, error) {
	file, err := fh.Open()
	if err != nil {
		return 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)

	linesCount, err := CountLinesInCSV(fh)
	if err != nil {
		return 0, err
	}

	var contentBuilder strings.Builder
	for i := 0; i < linesCount && scanner.Scan(); i++ {
		if i > 0 {
			contentBuilder.WriteRune('\n')
		}
		contentBuilder.WriteString(scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return 0, err
	}

	sampleContent := contentBuilder.String()

	return detectDelimiter(sampleContent), nil
}

// detectDelimiter tries to guess the delimiter used in the CSV content.
func detectDelimiter(content string) rune {
	delimiters := []rune{',', ';', '\t', '|'}
	delimiterCounts := make(map[rune]int)

	for _, delim := range delimiters {
		delimiterCounts[delim] = strings.Count(content, string(delim))
	}

	guessedDelimiter := ','
	maxCount := 0
	for delim, count := range delimiterCounts {
		if count > maxCount {
			guessedDelimiter = delim
			maxCount = count
		}
	}

	return guessedDelimiter
}
