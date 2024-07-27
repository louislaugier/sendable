package handlers

import (
	"email-validator/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func Subscribe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body := models.SubscribeRequest{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		handleError(w, err, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	//

	fmt.Fprint(w, http.StatusText(http.StatusOK))
}
