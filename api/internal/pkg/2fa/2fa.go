package two_factor_auth

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base32"
	"strconv"
	"strings"
	"time"
)

func Verify2FA(code, secret string) bool {
	// Get the current timestamp
	now := time.Now().Unix()

	// Check the code for the current timestamp and the two surrounding ones
	for i := -1; i <= 1; i++ {
		if GetCurrentCode(secret, now+int64(i*30)) == code {
			return true
		}
	}

	return false
}

func GetCurrentCode(secret string, timestamp int64) string {
	// Convert the secret from base32 to bytes
	key, _ := base32.StdEncoding.DecodeString(strings.ToUpper(secret))

	// Convert the timestamp to bytes
	message := toBytes(timestamp / 30)

	// Create a new HMAC-SHA1 hasher
	h := hmac.New(sha1.New, key)
	h.Write(message)
	hash := h.Sum(nil)

	// Use dynamic truncation to find our code
	offset := hash[len(hash)-1] & 0xF

	result := (int(hash[offset]&0x7F) << 24) |
		(int(hash[offset+1]&0xFF) << 16) |
		(int(hash[offset+2]&0xFF) << 8) |
		(int(hash[offset+3] & 0xFF))

	// Convert the code to a string
	code := strconv.Itoa(result % 1000000)

	// Add leading zeros if necessary
	for len(code) < 6 {
		code = "0" + code
	}

	return code
}

func toBytes(value int64) []byte {
	var result []byte
	for value > 0 {
		result = append(result, byte(value&0xFF))
		value >>= 8
	}
	return result
}
