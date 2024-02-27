package file

import (
	"email-validator/internal/pkg/format"
	"fmt"
	"io"
	"os"
	"strconv"
	"sync"

	"github.com/extrame/xls"
	"github.com/tealeg/xlsx"
)

func GetEmailsFromXLSX(reader io.Reader) ([]string, error) {
	cells, err := getCellsFromXLSX(reader)
	if err != nil {
		return nil, err
	}

	return processCellsInParallel(cells), nil
}

func GetEmailsFromXLS(reader io.Reader) ([]string, error) {
	cells, err := getCellsFromXLS(reader)
	if err != nil {
		return nil, err
	}

	return processCellsInParallel(cells), nil
}

func getCellsFromXLSX(reader io.Reader) ([]string, error) {
	tempFile, err := os.CreateTemp("", "temp.xlsx")
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

	var cells []string
	for _, sheet := range xlFile.Sheets {
		for _, row := range sheet.Rows {
			for _, cell := range row.Cells {
				text := cell.String()
				cells = append(cells, text)
			}
		}
	}

	return cells, nil
}

func getCellsFromXLS(reader io.Reader) ([]string, error) {
	tempFile, err := os.CreateTemp("", "email-validator-*.xls")
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

	workbook, err := xls.Open(tempFile.Name(), "utf-8")
	if err != nil {
		return nil, fmt.Errorf("failed to open xls file: %w", err)
	}

	var cells []string
	for sheetIndex := 0; sheetIndex < workbook.NumSheets(); sheetIndex++ {
		sheet := workbook.GetSheet(sheetIndex)
		for rowIndex := 0; rowIndex <= int(sheet.MaxRow); rowIndex++ {
			row := sheet.Row(rowIndex)
			for colIndex := 0; colIndex < row.LastCol(); colIndex++ {
				cell := row.Col(colIndex)
				cells = append(cells, cell)
			}
		}
	}

	return cells, nil
}

// This helper function takes a slice of cells and returns a slice of emails after validation in parallel
func processCellsInParallel(cells []string) []string {
	threadsCountEnv := os.Getenv("THREADS_COUNT")
	threadsCount, err := strconv.Atoi(threadsCountEnv)
	if err != nil || threadsCount < 1 {
		threadsCount = 1 // Fallback to single-threaded if THREADS_COUNT is invalid or not set
	}

	var wg sync.WaitGroup
	emailChan := make(chan string, len(cells)) // Buffered channel for collecting emails
	errorChan := make(chan error, 1)           // Buffered channel for error handling

	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(partitionIndex int) {
			defer wg.Done()
			for j, c := range cells {
				if j%threadsCount == partitionIndex {
					if format.IsEmailValid(c) {
						emailChan <- c
					}
				}
			}
		}(i)
	}

	wg.Wait()
	close(emailChan)

	// Check for an error
	select {
	case err := <-errorChan:
		fmt.Println("Error processing emails:", err) // Handle or return the error as needed
		close(errorChan)
	default:
		close(errorChan)
	}

	var emails []string
	for email := range emailChan {
		emails = append(emails, email)
	}
	return emails
}
