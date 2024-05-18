package middleware

import (
	"context"
	"email-validator/internal/models"
	"email-validator/internal/pkg/file"
	"email-validator/internal/pkg/utils"
	"fmt"
	"log"
	"net/http"
	"strings"
)

func ValidateFile(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uploadedFile, uploadedFileHeader, err := r.FormFile("file")

		// if request is formatted for bulk validation from file but no file is found in "file" field
		if uploadedFileHeader == nil || (err != nil && r.Header.Get("Content-Type") == "multipart/form-data") {
			w.WriteHeader(http.StatusBadRequest)
			log.Printf("Error parsing multipart form: %v", err)
			return
		}

		if r.Header.Get("Content-Type") == "multipart/form-data" {
			preventSizeExceedingFile(w, r)
		}

		// TODO: ClamAV

		filename := uploadedFileHeader.Filename
		filePath := fmt.Sprintf("./files/bulk_validation_uploads/%s", filename)

		go func() {
			if err := file.SaveMultipart(uploadedFileHeader, filePath); err != nil {
				log.Printf("Failed to save uploaded file: %v", err)
				http.Error(w, "Failed to save file", http.StatusInternalServerError)
				return
			}
		}()

		fileExtension := utils.GetExtensionFromFilename(filename)
		if !fileExtension.IsAllowed() {
			http.Error(w, "Invalid file extension", http.StatusBadRequest)
			return
		}

		columnsToScan := []string{}
		if r.FormValue("columnsToScan") != "" {
			columnsToScan = strings.Split(r.FormValue("columnsToScan"), ",")
		}

		fileData := models.FileData{
			UploadedFile:       uploadedFile,
			UploadedFileHeader: uploadedFileHeader,
			ColumnsToScan:      columnsToScan,
		}

		ctx := context.WithValue(r.Context(), fileDataKey, fileData)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func preventSizeExceedingFile(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(30 << 20) // 30 MB maximum per request
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error parsing multipart form: %v", err)
		return
	}
}
