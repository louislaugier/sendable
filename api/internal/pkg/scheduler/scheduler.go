package scheduler

import (
	"log"
	"net/http"
	"time"

	cron "github.com/robfig/cron/v3"
)

// Start initializes and starts the cron scheduler.
func Start() {
	log.Println("Starting scheduler with cron expression...")

	// Use WithSeconds to enable parsing of the seconds field
	c := cron.New(cron.WithSeconds())

	// Schedule the ping job to run at the 0th second of every 5th minute.
	_, err := c.AddFunc("0 */5 * * * *", func() {
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
	url := "https://sendable.onrender.com"

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
