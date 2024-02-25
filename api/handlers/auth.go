package handlers

import (
	"email-validator/internal/models"
	"encoding/json"
	"log"
	"net/http"
)

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodPost {
		u := &models.User{}
		if err := json.NewDecoder(r.Body).Decode(u); err != nil || u.Email == "" || u.Password == "" {
			if err != nil {
				log.Println(err)
			}
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// res, err := user.Login(u, utils.GetClientIPAddresses(r))
		// if err != nil {
		// 	log.Println(err)
		// 	http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		// 	return
		// }

		// JWT

		// json.NewEncoder(w).Encode()

	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
