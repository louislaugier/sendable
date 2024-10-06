package middleware

import (
	"context"
	"sendable/config"
	"sendable/internal/models"
	"sendable/internal/pkg/file"
	"sendable/internal/pkg/utils"
	"fmt"
	"log"
	"net/http"
	"strings"
)

func ValidateFile(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uploadedFile, uploadedFileHeader, err := r.FormFile("file")

		if utils.IsMultipartFormContentType(r) {
			if err != nil || uploadedFileHeader == nil {
				w.WriteHeader(http.StatusBadRequest)
				log.Printf("Error parsing multipart form: %v", err)
				return
			}

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

			// TODO: check mime type

			columnsToScan := []string{}
			if r.FormValue("columnsToScan") != "" {
				columnsToScan = strings.Split(r.FormValue("columnsToScan"), ",")
			}

			fileData := models.FileData{
				UploadedFile:       uploadedFile,
				UploadedFileHeader: uploadedFileHeader,
				ColumnsToScan:      columnsToScan,
			}

			// here when fileData is not nil, it is nil in ValidateEmailsHandler (it shouldn't be, need to fix this)
			ctx := context.WithValue(r.Context(), fileDataKey, &fileData)
			next.ServeHTTP(w, r.WithContext(ctx))

			return
		}

		next.ServeHTTP(w, r)
	})
}

func preventSizeExceedingFile(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(config.UploadFileSizeLimit)

	if err != nil {
		http.Error(w, fmt.Sprintf("File size exceed limit of %d MB", config.UploadFileSizeLimit), http.StatusBadRequest)
		return
	}
}
