package config

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func initDatabaseConnection() {
	var URL string

	switch OSEnv {
	case ProdEnv:
		URL = os.Getenv("DATABASE_URL")
	case DevEnv:
		URL = "postgres://postgres:pass@db:5432/db?sslmode=disable"
	}

	d, err := sql.Open("postgres", URL)
	if err != nil {
		panic(err)
	}

	if err := d.Ping(); err != nil {
		panic(err)
	}

	DB = d
}
