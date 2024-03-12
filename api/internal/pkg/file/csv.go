package file

import (
	"bufio"
	"email-validator/internal/models"
	"email-validator/internal/pkg/format"
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"reflect"
	"strconv"
	"strings"
	"sync"

	"github.com/google/uuid"
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

// CreateCSVReport generates a CSV report based on the provided data.
func CreateCSVReport(report []models.ReacherResponse, ID uuid.UUID) (*os.File, error) {
	file, err := os.Create(fmt.Sprintf("./reports/%s.csv", ID.String()))
	if err != nil {
		return nil, err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	header := generateHeader(models.ReacherResponse{})
	err = writer.Write(header)
	if err != nil {
		return nil, err
	}

	// Write data
	for _, item := range report {
		var reachability string
		switch item.Reachability {
		case models.ReachabilitySafe:
			reachability = "reachable with a good reputation"
		case models.ReachabilityRisky:
			reachability = "existing with a low reputation"
		case models.ReachabilityUnknown:
			reachability = "unknown (domain protected)"
		case models.ReachabilityInvalid:
			reachability = "non-existing (will bounce)"
		}

		row := []string{
			item.Input,
			reachability,
			strconv.FormatBool(item.Misc.IsDisposable),
			strconv.FormatBool(item.Misc.IsRoleAccount),
			strconv.FormatBool(item.SMTP.HasFullInbox),
			strconv.FormatBool(item.SMTP.IsCatchAll),
			strconv.FormatBool(item.SMTP.IsDisabled),
			strconv.FormatBool(!item.Syntax.IsValidSyntax),
		}
		err = writer.Write(row)
		if err != nil {
			return nil, err
		}
	}

	return file, nil
}

// generateHeader dynamically generates the header based on the CSV tags of the struct fields.
func generateHeader(r models.ReacherResponse) []string {
	var header []string
	t := reflect.TypeOf(r)
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		tag := field.Tag.Get("csv")
		if tag != "" && tag != "-" {
			header = append(header, tag)
		}
	}
	return header
}
