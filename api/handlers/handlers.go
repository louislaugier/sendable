package handlers

import (
	"fmt"
	"log"
	"net/http"
)

func StartHTTPSServer() {
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
