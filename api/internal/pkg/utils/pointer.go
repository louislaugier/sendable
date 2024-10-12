package utils

// Generic function that takes a type and returns a pointer to it
func NewPointer[T any](value T) *T {
	return &value
}
