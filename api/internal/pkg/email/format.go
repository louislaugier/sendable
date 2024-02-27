package email

import (
	"strings"
	"unicode"
)

func hasMoreLettersThanNumbersInUsername(email string) bool {
	username := strings.Split(email, "@")[0]
	numLetters := 0
	numNumbers := 0
	for _, char := range username {
		if unicode.IsLetter(char) {
			numLetters++
		} else if unicode.IsNumber(char) {
			numNumbers++
		}
	}

	return numNumbers <= numLetters
}
