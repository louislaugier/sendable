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
		if err := godotenv.Load("../.env"); err != nil {
			if err = godotenv.Load(".env"); err != nil {
				log.Fatal("godotenv.Load: ", err)
			}
		}

	}

	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, http.StatusText(http.StatusOK))
	})

	// if os.Getenv("env") == "DEV" {
	// 	fmt.Println("HTTP server is listening on port 80...")
	// 	err := http.ListenAndServe(":80", nil)
	// 	if err != nil {
	// 		log.Fatal("ListenAndServe: ", err)
	// 	}
	// }

	fmt.Println("HTTPS server is listening on port 443...")
	if err := http.ListenAndServeTLS(":443", "../cert.pem", "../key.pem", nil); err != nil {
		if err = http.ListenAndServeTLS(":443", "cert.pem", "key.pem", nil); err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}

}
