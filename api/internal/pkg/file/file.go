package csv

import (
	"email-validator/internal/pkg/validate"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
	"sync"
	"unicode"
)

// should take a CSV file instead of file path
func GetValidEmailsFromCSVIntoNewCSV(inputPath string, outputPath string) {
	type EmailWithLine struct {
		Email      string
		LineNumber int
	}

	file, err := os.Open(inputPath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ';' // Assuming each email is separated by a semicolon.

	// Buffered channel to store valid emails.
	validEmailsChan := make(chan EmailWithLine, 100)

	// Channel to signal when all processing is done.
	doneChan := make(chan struct{})

	// Slice to hold valid emails after validation.
	var validEmails []string

	// Mutex to protect access to validEmails slice.
	var mu sync.Mutex
	var wg sync.WaitGroup

	// proxyFile, err := os.Open("proxies.txt")
	// if err != nil {
	// 	fmt.Println("Error opening proxy file:", err)
	// 	return
	// }
	// defer proxyFile.Close()
	// scanner := bufio.NewScanner(proxyFile)
	// var proxies []string
	// for scanner.Scan() {
	// 	proxies = append(proxies, scanner.Text())
	// }
	// if err := scanner.Err(); err != nil {
	// 	fmt.Println("Error scanning proxies:", err)
	// 	return
	// }

	// Start a worker pool to validate emails.
	for i := 0; i < 128; i++ { // Worker pool size can be adjusted.
		wg.Add(1)
		go func() {
			defer wg.Done()
			for ewl := range validEmailsChan {
				username := strings.Split(ewl.Email, "@")[0] // Extracting the username part of the email
				numLetters := 0
				numNumbers := 0
				for _, char := range username {
					if unicode.IsLetter(char) {
						numLetters++
					} else if unicode.IsNumber(char) {
						numNumbers++
					}
				}
				if numNumbers <= numLetters { // Only process emails where number of numbers <= number of letters
					if err := validate.ValidateEmailAddressFromAPI(ewl.Email); err == nil {
						mu.Lock()
						log.Printf("Valid email on line %d: %s.\n", ewl.LineNumber, ewl.Email)
						validEmails = append(validEmails, ewl.Email)
						mu.Unlock()
					} else if ewl.Email != "E-MAIL" {
						log.Printf("Invalid email on line %d: %s. Error: %s\n", ewl.LineNumber, ewl.Email, err)
					}
				}
			}
		}()

	}

	// Go routine to wait for worker pool to finish and close done channel.
	go func() {
		wg.Wait()
		close(doneChan)
	}()

	// Read from the CSV and send emails to be validated.
	lineNumber := 1 // Initialize line number counter.
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error reading CSV on line %d: %v\n", lineNumber, err)
			lineNumber++
			continue
		}
		emails := strings.Split(record[0], ";")
		for _, email := range emails {
			email = strings.TrimSpace(email)
			if email != "" {
				validEmailsChan <- EmailWithLine{Email: email, LineNumber: lineNumber}
			}
		}
		lineNumber++
	}
	close(validEmailsChan)

	// Waiting for all emails to be processed.
	<-doneChan

	// Now write the valid emails to the output CSV file.
	outputFile, err := os.Create(outputPath)
	if err != nil {
		fmt.Println("Error creating an output file:", err)
		return
	}
	defer outputFile.Close()

	writer := csv.NewWriter(outputFile)
	// writer.Comma = ';'
	defer writer.Flush()

	writer.Write([]string{"EMAIL" + ";"})
	for _, validEmail := range validEmails {
		if err := writer.Write([]string{validEmail + ";"}); err != nil {
			log.Printf("Error writing to CSV: %v\n", err)
			return
		}
	}
}
