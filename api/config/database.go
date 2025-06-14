package config

import (
	"database/sql"
	"fmt"
	"net/url"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func initDatabaseConnection() {

	URL := fmt.Sprintf("postgres://%s:%s@%s:5432/db?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		url.QueryEscape(os.Getenv("POSTGRES_PASSWORD")),
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
