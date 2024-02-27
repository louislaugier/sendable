package file

import (
	"email-validator/internal/pkg/format"
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
func GetEmailsFromXLSX(file multipart.File) ([]string, error) {
	cells, err := getCellsFromXLSX(file)
	if err != nil {
		return nil, err
	}

	return processCellsInParallel(cells), nil
}

// Updated to handle multipart file uploads
func GetEmailsFromXLS(file multipart.File) ([]string, error) {
	cells, err := getCellsFromXLS(file)
	if err != nil {
		return nil, err
	}

	return processCellsInParallel(cells), nil
}

func getCellsFromXLSX(file multipart.File) ([]string, error) {
	tempFile, err := os.CreateTemp("", "temp.xlsx")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tempFile.Name()) // Clean up the file afterwards

	file.Seek(0, io.SeekStart) // Reset the file pointer to the beginning of the file
	_, err = io.Copy(tempFile, file)
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

func getCellsFromXLS(file multipart.File) ([]string, error) {
	tempFile, err := os.CreateTemp("", "email-validator-*.xls")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tempFile.Name()) // Clean up the file afterwards

	file.Seek(0, io.SeekStart) // Reset the file pointer to the beginning of the file
	_, err = io.Copy(tempFile, file)
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
		if sheet == nil {
			continue
		}
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

func processCellsInParallel(cells []string) []string {
	threadsCountEnv := os.Getenv("THREADS_COUNT")
	threadsCount, err := strconv.Atoi(threadsCountEnv)
	if err != nil || threadsCount < 1 {
		threadsCount = 1 // Fallback to single-threaded if THREADS_COUNT is invalid or not set
	}

	var wg sync.WaitGroup
	emailChan := make(chan string, len(cells)) // Buffered channel for collecting emails
	defer close(emailChan)

	for i := 0; i < threadsCount; i++ {
		wg.Add(1)
		go func(partitionIndex int) {
			defer wg.Done()
			for j, cell := range cells {
				if j%threadsCount == partitionIndex && format.IsEmailValid(cell) {
					emailChan <- cell
				}
			}
		}(i)
	}
	wg.Wait()

	var emails []string
	for email := range emailChan {
		emails = append(emails, email)
	}
	return emails
}
