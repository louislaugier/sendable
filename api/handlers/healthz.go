package handlers

import (
	"fmt"
	"net/http"
)

func HealthzHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
