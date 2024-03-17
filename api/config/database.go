package config

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	connectionType, URL := "postgres", os.Getenv("DATABASE_URL")

	if os.Getenv("ENV") == "dev" {
		URL = "postgres://postgres:pass@db:5432/db?sslmode=disable"
	}

	d, err := sql.Open(connectionType, URL)
	if err != nil {
		panic(err)
	}

	if err := d.Ping(); err != nil {
		panic(err)
	}

	DB = d
}
