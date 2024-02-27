package handlers

import (
	"email-validator/handlers/middleware"
	"fmt"
	"log"
	"net"
	"net/http"
	"regexp"
	"strings"
)

func defineRoutes() {
	http.HandleFunc("/healthz", HealthzHandler)

	http.Handle("/auth", middleware.ValidateJWT(http.HandlerFunc(AuthHandler)))

	http.Handle("/validate_email", middleware.ValidateJWT(http.HandlerFunc(ValidateEmailHandler)))
	http.Handle("/validate_emails", middleware.ValidateJWT(http.HandlerFunc(ValidateEmailsHandler)))
}

func StartHTTPSServer() {
	defineRoutes()

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

// helper function to retrieve IPs from request
func GetIPsFromRequest(r *http.Request) string {
	ipsMap := make(map[string]struct{})

	// Helper function to add IP to the map if it's not already in it
	addIP := func(ip string) {
		ip = strings.TrimSpace(ip)
		if ip != "" {
			_, ipNet, err := net.ParseCIDR(ip)
			if err == nil {
				ip = strings.Split(ipNet.String(), "/")[0]
			} else {
				// Could be just a plain IP without CIDR notation
				parsedIP := net.ParseIP(ip)
				if parsedIP != nil {
					ip = parsedIP.String()
				}
			}
			if _, exists := ipsMap[ip]; !exists {
				ipsMap[ip] = struct{}{}
			}
		}
	}

	// Get IP from RemoteAddr
	addIP(strings.Split(r.RemoteAddr, ":")[0])

	// Get IPs from X-Forwarded-For and add them to the map
	for _, ip := range strings.Split(r.Header.Get("X-Forwarded-For"), ",") {
		addIP(ip)
	}

	// Get IP from X-Real-IP and add to map
	addIP(r.Header.Get("X-Real-IP"))

	// Get IP from Forwarded header
	forwardedHeader := r.Header.Get("Forwarded")
	for _, match := range regexp.MustCompile(`for=("[^"]*"|[^;,\s]+)`).FindAllStringSubmatch(forwardedHeader, -1) {
		if len(match) > 1 {
			// Remove potential double-quotes around the IP
			addIP(strings.Trim(match[1], `"`))
		}
	}

	// Construct a slice of IPs
	var ipsSlice []string
	for ip := range ipsMap {
		ipsSlice = append(ipsSlice, ip)
	}

	// Join all IPs as a single string
	return strings.Join(ipsSlice, ", ")
}
