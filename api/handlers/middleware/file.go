package middleware

import (
	"context"
	"email-validator/config"
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
		if r.Header.Get("Content-Type") == "multipart/form-data" && (err != nil || uploadedFileHeader == nil) {
			w.WriteHeader(http.StatusBadRequest)
			log.Printf("Error parsing multipart form: %v", err)
			return
		}

		if r.Header.Get("Content-Type") == "multipart/form-data" {
			preventSizeExceedingFile(w, r)

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
			return
		}

		next.ServeHTTP(w, r)
	})
}

func preventSizeExceedingFile(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(int64(config.UploadFileSizeLimitMegaBytes) << 20)
	if err != nil {
		http.Error(w, fmt.Sprintf("File size exceed limit of %d MB", config.UploadFileSizeLimitMegaBytes), http.StatusBadRequest)
		return
	}
}
