package handlers

import (
	"fmt"
	"log"
	"net/http"
)

func HealthzHandler(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprint(w, http.StatusText(http.StatusNoContent))
}

func handleError(w http.ResponseWriter, errorToLog error, messageToReturn string, statusCode int) {
	log.Printf("%s: %v", messageToReturn, errorToLog)
	http.Error(w, messageToReturn, statusCode)
}
