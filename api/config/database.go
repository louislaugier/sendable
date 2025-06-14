package config

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func initDatabaseConnection() {

	URL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		"db",   // docker service name
		"5432", // default
		os.Getenv("POSTGRES_DB"),
	)

	d, err := sql.Open("postgres", URL)
	if err != nil {
		panic(err)
	}

	if err := d.Ping(); err != nil {
		panic(err)
	}

	DB = d
}
