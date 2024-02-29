package file

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"time"
)

// Save saves the provided file
func Save(fileHeader *multipart.FileHeader, filePath string) error {
	source, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer source.Close()

	destination, err := os.Create(filePath)
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
	file, err := os.Create(fmt.Sprintf(`%s.csv`, filePath))
	if err != nil {
		return err
	}
	defer file.Close()
	writer := csv.NewWriter(file)
	defer writer.Flush()

	// first line is the timestamp followed by author IPs
	err = writer.Write([]string{timestamp.Local().String(), IPs})
	if err != nil {
		log.Println("Error writing IPs and timestamp to CSV:", err)
		return err
	}

	for _, str := range data {
		err := writer.Write([]string{str})
		if err != nil {
			log.Println("Error writing string to CSV:", err)
			return err
		}
	}

	return nil
}
