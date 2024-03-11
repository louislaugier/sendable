package file

import (
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Save saves the provided file
func Save(fileHeader *multipart.FileHeader, filePath string) error {
	source, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer source.Close()

	destination, err := getUniqueFile(filePath)
	if err != nil {
		return err
	}
	defer destination.Close()

	_, err = io.Copy(destination, source)
	if err != nil {
		return err
	}

	return nil
}

// SaveStringsToNewCSV saves a list of strings to a new CSV file
func SaveStringsToNewCSV(data []string, filePath string, IPs string, timestamp time.Time) error {
	file, err := getUniqueFile(filePath)
	if err != nil {
		return err
	}
	defer file.Close()
	writer := csv.NewWriter(file)
	defer writer.Flush()

	// First line is the timestamp followed by author IPs
	err = writer.Write([]string{timestamp.Local().String(), IPs})
	if err != nil {
		return err
	}

	for _, str := range data {
		err := writer.Write([]string{str})
		if err != nil {
			return err
		}
	}

	return nil
}

// getUniqueFile returns a unique file by appending a small suffix to the filepath if it already exists
func getUniqueFile(filePath string) (*os.File, error) {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		// File doesn't exist, return the file directly
		return os.Create(filePath)
	}

	// If file already exists, find a unique filename
	baseName := strings.TrimSuffix(filePath, filepath.Ext(filePath))
	ext := filepath.Ext(filePath)
	for i := 1; ; i++ {
		newFilePath := fmt.Sprintf("%s_%d%s", baseName, i, ext)
		if _, err := os.Stat(newFilePath); os.IsNotExist(err) {
			return os.Create(newFilePath)
		}
	}
}
