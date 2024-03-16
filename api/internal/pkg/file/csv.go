package file

import (
	"bufio"
	"email-validator/internal/models"
	"email-validator/internal/pkg/format"
	"encoding/csv"
	"fmt"
	"io"
	"log"
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
func CreateCSVReport(report []models.ReacherResponse, ID uuid.UUID) (string, error) {
	log.Println("the report:", report)
	filePath := fmt.Sprintf("./reports/%s.csv", ID.String())
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	writer := csv.NewWriter(file)

	// Write header
	header := generateHeader(reflect.ValueOf(models.ReacherResponse{}))
	if err := writer.Write(header); err != nil {
		file.Close() // explicitly handle file.Close() error by ignoring it as err is already set
		return "", err
	}

	// Write data
	for _, item := range report {
		record := generateRecord(reflect.ValueOf(item))
		customFormatRecord(&record, item, header)
		if err := writer.Write(record); err != nil {
			writer.Flush() // explicitly handle writer.Flush() error by ignoring it as err is already set
			file.Close()   // explicitly handle file.Close() error by ignoring it as err is already set
			return "", err
		}
	}

	// Flush and check for errors
	writer.Flush()
	if err := writer.Error(); err != nil {
		file.Close() // explicitly handle file.Close() error by ignoring it as err is already set
		return "", err
	}

	// Handle the error from closing the file after all operations are complete
	if err := file.Close(); err != nil {
		return "", err
	}

	return filePath, nil
}

// customFormatRecord formats the record for custom CSV fields.
func customFormatRecord(record *[]string, item models.ReacherResponse, header []string) {
	for i, headerItem := range header {
		switch headerItem {
		case "Email":
			(*record)[i] = item.Input
		case "Reachability":
			switch item.Reachability {
			case models.ReachabilitySafe:
				(*record)[i] = "reachable with good reputation"
			case models.ReachabilityRisky:
				(*record)[i] = "existing with low reputation"
			case models.ReachabilityUnknown:
				(*record)[i] = "unknown (domain protected)"
			case models.ReachabilityInvalid:
				(*record)[i] = "non-existing (will bounce)"
			}
		case "Syntax issues":
			(*record)[i] = strconv.FormatBool(!item.Syntax.IsValidSyntax)
			// Add more custom formatting logic here if needed
		default:
			// Use getFieldByCSVTag for fields that don't require specific formatting.
			fieldValue := getFieldByCSVTag(reflect.ValueOf(item), headerItem)
			if fieldValue.IsValid() {
				switch fieldValue.Kind() {
				case reflect.Bool:
					(*record)[i] = strconv.FormatBool(fieldValue.Bool())
				case reflect.String:
					(*record)[i] = fieldValue.String()
					// Handle other types if necessary.
				}
			}
		}
	}
}

// Recursively generate record based on the "csv" tags in struct fields.
func generateRecord(value reflect.Value) []string {
	var record []string

	// Navigate through the fields of the struct value.
	for i := 0; i < value.NumField(); i++ {
		field := value.Field(i)      // Get the field value.
		typ := value.Type().Field(i) // Get the field type.

		// Check if this field is itself a struct.
		if field.Kind() == reflect.Struct {
			// Recursively get records from nested struct.
			nestedRecords := generateRecord(field)
			record = append(record, nestedRecords...)
		} else {
			tag := typ.Tag.Get("csv")
			if tag != "" && tag != "-" {
				record = append(record, fmt.Sprint(field.Interface()))
			}
		}
	}
	return record
}

// Recursively generate CSV header based on the "csv" tags in struct fields.
func generateHeader(value reflect.Value) []string {
	var header []string

	// Navigate through the fields of the struct value.
	for i := 0; i < value.NumField(); i++ {
		field := value.Field(i)      // Get the field value.
		typ := value.Type().Field(i) // Get the field type.

		// Check if this field is itself a struct.
		if field.Kind() == reflect.Struct {
			// Recursively get headers from nested struct.
			nestedHeaders := generateHeader(field)
			header = append(header, nestedHeaders...)
		} else {
			tag := typ.Tag.Get("csv")
			if tag != "" && tag != "-" {
				header = append(header, tag)
			}
		}
	}
	return header
}

// getFieldByCSVTag finds a field by its CSV tag in the struct or nested structs.
func getFieldByCSVTag(v reflect.Value, tagToFind string) reflect.Value {
	if v.Kind() == reflect.Struct {
		t := v.Type()
		for i := 0; i < v.NumField(); i++ {
			field := v.Field(i)
			fieldType := t.Field(i)
			csvTag := fieldType.Tag.Get("csv")
			if csvTag == tagToFind {
				return field
			}
			// Check for nested struct and search recursively
			if field.Kind() == reflect.Struct {
				nestedField := getFieldByCSVTag(field, tagToFind)
				if nestedField.IsValid() {
					return nestedField
				}
			}
		}
	}
	return reflect.Value{}
}
