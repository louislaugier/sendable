package scheduler

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	cron "github.com/robfig/cron/v3"
)

// StartScheduler initializes and starts the cron scheduler.
func StartScheduler() {
	log.Println("Starting scheduler with cron expression...")

	// Use WithSeconds to enable parsing of the seconds field
	c := cron.New(cron.WithSeconds())

	// Schedule the ping job to run at 45 seconds past every 4th minute.
	// This is the closest standard cron expression to 4 minutes and 45 seconds.
	_, err := c.AddFunc("45 */4 * * * *", func() {
		pingRenderService()
	})

	if err != nil {
		log.Printf("Error scheduling ping job: %v", err)
		return
	}

	c.Start()

	// Keep the scheduler running in the background
	// select {}
}

// pingRenderService sends an HTTP GET request to the Render service.
func pingRenderService() {
	domain := os.Getenv("DOMAIN")
	if domain == "" {
		log.Println("DOMAIN environment variable not set, skipping ping.")
		return
	}

	url := fmt.Sprintf("https://%s", domain)

	client := &http.Client{
		Timeout: 10 * time.Second, // Set a timeout for the request
	}

	log.Printf("Pinging %s", url)
	resp, err := client.Get(url)
	if err != nil {
		log.Printf("Error pinging %s: %v", url, err)
		return
	}
	defer resp.Body.Close()

	log.Printf("Ping successful %s, status code: %d", url, resp.StatusCode)
}
