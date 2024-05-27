package file

import (
	"email-validator/internal/pkg/format"
	"email-validator/internal/pkg/utils"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"sync"

	"github.com/extrame/xls"
	"github.com/tealeg/xlsx"
)

// Updated to handle multipart file uploads
func GetEmailsFromXLSX(file multipart.File, columnsToScan []string) ([]string, error) {
	cells, err := getCellsFromXLSX(file, columnsToScan)
	if err != nil {
		return nil, err
	}

	return processCellsInParallel(cells), nil
}

// Updated to handle multipart file uploads
func GetEmailsFromXLS(file multipart.File, columnsToScan []string) ([]string, error) {
	cells, err := getCellsFromXLS(file, columnsToScan)
	if err != nil {
		return nil, err
	}

	return processCellsInParallel(cells), nil
}

// Creates a temporary file, copies the contents to it, and closes the file.
// Returns the file path of the temporary file for further processing.
func createTempFile(file multipart.File, pattern string) (string, error) {
	tempFile, err := os.CreateTemp("", pattern)
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer tempFile.Close()

	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return "", fmt.Errorf("failed to seek in file: %w", err)
	}

	_, err = io.Copy(tempFile, file)
	if err != nil {
		return "", fmt.Errorf("failed to copy to temp file: %w", err)
	}

	return tempFile.Name(), nil
}

func getCellsFromXLSX(file multipart.File, columnsToScan []string) ([]string, error) {
	tempFileName, err := createTempFile(file, "temp.xlsx")
	if err != nil {
		return nil, err
	}
	defer os.Remove(tempFileName) // Clean up the file afterwards

	xlFile, err := xlsx.OpenFile(tempFileName)
	if err != nil {
		return nil, fmt.Errorf("failed to open xlsx: %w", err)
	}

	var cells []string
	for _, sheet := range xlFile.Sheets {
		var columnIndices []int
		if len(columnsToScan) > 0 {
			headerRow := sheet.Rows[0]
			for i, cell := range headerRow.Cells {
				if utils.Contains(columnsToScan, cell.String()) {
					columnIndices = append(columnIndices, i)
				}
			}
		}
		for _, row := range sheet.Rows {
			for i, cell := range row.Cells {
				if len(columnIndices) == 0 || utils.ContainsInt(columnIndices, i) {
					text := cell.String()
					cells = append(cells, text)
				}
			}
		}
	}

	return cells, nil
}

func getCellsFromXLS(file multipart.File, columnsToScan []string) ([]string, error) {
	tempFileName, err := createTempFile(file, "email-validator-*.xls")
	if err != nil {
		return nil, err
	}
	defer os.Remove(tempFileName) // Clean up the file afterwards

	workbook, err := xls.Open(tempFileName, "utf-8")
	if err != nil {
		return nil, fmt.Errorf("failed to open xls file: %w", err)
	}

	var cells []string
	for sheetIndex := 0; sheetIndex < workbook.NumSheets(); sheetIndex++ {
		sheet := workbook.GetSheet(sheetIndex)
		if sheet == nil {
			continue
		}
		var columnIndices []int
		if len(columnsToScan) > 0 {
			headerRow := sheet.Row(0)
			for i := 0; i < headerRow.LastCol(); i++ {
				if utils.Contains(columnsToScan, headerRow.Col(i)) {
					columnIndices = append(columnIndices, i)
				}
			}
		}
		for rowIndex := 0; rowIndex <= int(sheet.MaxRow); rowIndex++ {
			row := sheet.Row(rowIndex)
			for colIndex := 0; colIndex < row.LastCol(); colIndex++ {
				if len(columnIndices) == 0 || utils.ContainsInt(columnIndices, colIndex) {
					cell := row.Col(colIndex)
					cells = append(cells, cell)
				}
			}
		}
	}

	return cells, nil
}

func processCellsInParallel(cells []string) []string {
	threadsCountEnv := os.Getenv("THREADS_COUNT")
	threadsCount, err := strconv.Atoi(threadsCountEnv)
	if err != nil || threadsCount < 1 {
		threadsCount = 1 // Fallback to single-threaded if THREADS_COUNT is invalid or not set
	}

	// Update the channel to be unbuffered, since we close it only after the WaitGroup is done.
	emailChan := make(chan string)
	var wg sync.WaitGroup

	// Start goroutines for processing partitions of cells.
	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(partitionIndex int) {
			defer wg.Done()
			for j, cell := range cells {
				if j%threadsCount == partitionIndex {
					processedEmail := format.ExtractEmail(cell)
					if format.IsEmailValid(processedEmail) {
						emailChan <- processedEmail
					}
				}
			}
		}(i)
	}

	// Start a goroutine to close the emailChan after all processing is done.
	go func() {
		wg.Wait()
		close(emailChan)
	}()

	var emails []string
	for email := range emailChan {
		emails = append(emails, email)
	}

	return emails
}
