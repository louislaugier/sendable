package utils

import (
	"crypto/rand"
	"math/big"
)

func GenerateSixDigitCode() (*int, error) {
	// Define the range for the 6-digit number (from 100000 to 999999)
	min := big.NewInt(100000)
	max := big.NewInt(999999)

	// Generate a random number within the specified range
	n, err := rand.Int(rand.Reader, new(big.Int).Sub(max, min))
	if err != nil {
		return nil, err
	}

	// Add the minimum value to the random number to ensure it's within the desired range
	n.Add(n, min)

	// Convert the result to an int
	randomNumber := int(n.Int64())

	// Return the generated random 6-digit number as a pointer
	return &randomNumber, nil
}
