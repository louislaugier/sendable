package utils

import (
	"email-validator/internal/models"
	"path/filepath"
	"strings"
)

func GetExtensionFromFilename(filename string) models.FileExtension {
	ext := models.FileExtension(strings.ToLower(strings.TrimPrefix(filepath.Ext(filename), ".")))

	return ext
}
