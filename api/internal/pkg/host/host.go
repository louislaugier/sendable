package validate

import (
	"fmt"
	"log"
	"net"
	"net/smtp"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/proxy"
)

const (
	ForceDisconnectAfter = time.Second * 15
	SmtpPort             = 25
)

func ValidateHostMXAndDialServerWithProxy(host string) (*smtp.Client, error) {
	// Configuration for your proxy.
	proxyAddr := "68.71.254.6:4145" // Replace with your proxy's IP and port.

	// Establishing a connection to your proxy.
	dialer, err := proxy.SOCKS5("tcp", proxyAddr, nil, proxy.Direct)
	if err != nil {
		return nil, fmt.Errorf("error connecting to proxy: %v", err)
	}

	// Get the MX records for the host.
	mxRecords, err := net.LookupMX(host)
	if err != nil || len(mxRecords) == 0 {
		return nil, fmt.Errorf("LookupMX failed: %v", err)
	}

	// Attempt to connect to the SMTP server via the proxy.
	var smtpClient *smtp.Client
	for _, mxRecord := range mxRecords {
		serverAddr := strings.TrimSuffix(mxRecord.Host, ".") + ":" + strconv.Itoa(SmtpPort)
		log.Printf("Trying to connect to MX record: %s\n", serverAddr)
		conn, err := dialer.Dial("tcp", serverAddr)
		if err != nil {
			log.Println("abc", serverAddr)
			for _, v := range mxRecords {
				log.Println("xyz", v.Host)
			}
			log.Printf("Unable to dial to SMTP server via proxy: %s, error: %v\n", serverAddr, err)
			continue
		}

		log.Println("Dial to SMTP server successful, attempting to create SMTP client...")
		smtpClient, err = smtp.NewClient(conn, mxRecord.Host)
		if err != nil {
			conn.Close()
			log.Printf("SMTP client initialization failed for server: %s, error: %v\n", serverAddr, err)
			continue
		}
		log.Println("SMTP client successfully created")
		break
	}

	if smtpClient == nil {
		return nil, fmt.Errorf("unable to connect to any MX hosts")
	}

	return smtpClient, nil
}
