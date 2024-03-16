package file

import (
	"archive/zip"
	"encoding/base64"
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// SaveMultipart saves the provided file
func SaveMultipart(fileHeader *multipart.FileHeader, filePath string) error {
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

func ToBase64(file *os.File) (*string, error) {
	data, err := os.ReadFile(file.Name())
	if err != nil {
		return nil, err
	}

	b64data := base64.StdEncoding.EncodeToString(data)

	return &b64data, nil
}

func ToZIP(filePath string) (*os.File, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	zipFilePath := filePath + ".zip"
	zipFile, err := os.Create(zipFilePath)
	if err != nil {
		return nil, err
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// Get the file info
	fileInfo, err := file.Stat()
	if err != nil {
		return nil, err
	}

	header, err := zip.FileInfoHeader(fileInfo)
	if err != nil {
		return nil, err
	}

	header.Name = filepath.Base(file.Name())
	writer, err := zipWriter.CreateHeader(header)
	if err != nil {
		return nil, err
	}

	// Copy the contents of the file to the zip archive
	if _, err = file.Seek(0, io.SeekStart); err != nil {
		return nil, err
	}
	if _, err = io.Copy(writer, file); err != nil {
		return nil, err
	}

	return zipFile, nil
}
