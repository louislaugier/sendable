package main

import (
	"email-validator/internal/pkg/email"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("env") == "DEV" {
		godotenv.Load("../.env")
	}

	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, http.StatusText(http.StatusOK))
	})

	log.Println(email.Validate("l.laugier@pm.me"))

	fmt.Println("Server is listening on port 80...")
	http.ListenAndServe(":80", nil)
}
