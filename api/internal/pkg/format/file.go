package format

import (
	"email-validator/internal/models"
	"errors"
)

var ErrInvalidFileExt = errors.New("invalid file format")

var allowedFileExtensions = []models.FileExtension{
	models.FileExtensionCSV,
	models.FileExtensionTXT,
	models.FileExtensionXLS,
	models.FileExtensionXLSX,
}

func IsExtensionAllowed(extension models.FileExtension) bool {
	for _, ext := range allowedFileExtensions {
		if extension == ext {
			return true
		}
	}

	return false
}
