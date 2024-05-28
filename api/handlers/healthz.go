package handlers

import (
	"fmt"
	"log"
	"net/http"
)

func HealthzHandler(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprint(w, http.StatusText(http.StatusOK))
}

func handleError(w http.ResponseWriter, err error, message string, statusCode int) {
	log.Printf("%s: %v", message, err)
	http.Error(w, message, statusCode)
}
