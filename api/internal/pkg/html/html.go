package html

import (
	"email-validator/internal/models"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
	"text/template"
)

func GenerateEmail(template models.Template, variables map[string]string) (string, error) {
	// Open and read HTML file
	file, err := os.Open(fmt.Sprintf("%s.html", string(template)))
	if err != nil {
		log.Fatalf("Error opening HTML file: %v", err)
	}
	defer file.Close()

	// Read content from file
	content, err := io.ReadAll(file)
	if err != nil {
		log.Fatalf("Error reading HTML file: %v", err)
	}

	newHTML := replaceVariables(string(content), variables)

	return newHTML, nil
}

func replaceVariables(htmlContent string, variables map[string]string) string {
	// Create a new template with the HTML content
	tmpl, err := template.New("html").Parse(htmlContent)
	if err != nil {
		log.Fatalf("Error parsing HTML template: %v", err)
	}

	// Execute the template with the variables
	var buf strings.Builder
	err = tmpl.Execute(&buf, variables)
	if err != nil {
		log.Fatalf("Error executing template: %v", err)
	}

	return buf.String()
}
