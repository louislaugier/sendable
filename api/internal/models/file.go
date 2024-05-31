package models

import "mime/multipart"

const (
	FileExtensionCSV  FileExtension = "csv"
	FileExtensionTXT  FileExtension = "txt"
	FileExtensionXLS  FileExtension = "xls"
	FileExtensionXLSX FileExtension = "xlsx"
)

var allowedFileExtensions = []FileExtension{
	FileExtensionCSV,
	FileExtensionTXT,
	FileExtensionXLS,
	FileExtensionXLSX,
}

type (
	FileExtension string
	FileData      struct {
		UploadedFile       multipart.File
		UploadedFileHeader *multipart.FileHeader

		ColumnsToScan []string
	}
)

func (fe *FileExtension) IsAllowed() bool {
	for _, ext := range allowedFileExtensions {
		if *fe == ext {
			return true
		}
	}

	return false
}
