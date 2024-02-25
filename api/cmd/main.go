package main

import (
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

	if os.Getenv("env") == "DEV" {
		fmt.Println("Server is listening on port 80...")
		err := http.ListenAndServe(":80", nil)
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}

	fmt.Println("Server is listening on port 443...")
	err := http.ListenAndServeTLS(":443", "./cert.pem", "./key.pem", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
