package middleware

import (
	"crypto/sha256"
	"encoding/hex"
)

func EncryptPassword(password string) string {
	// Create a new SHA-256 hasher
	hasher := sha256.New()

	// Write the string to the hasher
	hasher.Write([]byte(password))

	// Get the SHA-256 hash
	hashBytes := hasher.Sum(nil)

	// Convert the hash bytes to a hexadecimal string
	hashStr := hex.EncodeToString(hashBytes)

	return hashStr
}
