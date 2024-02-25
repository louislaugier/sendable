package config

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	connectionType, URL := "postgres", os.Getenv("DATABASE_URL")

	if os.Getenv("env") == "dev" {
		URL = "postgres://postgres:pass@db:5432/db?sslmode=disable"
	}

	db, err := sql.Open(connectionType, URL)
	if err != nil {
		panic(err)
	}

	if err := db.Ping(); err != nil {
		panic(err)
	}

	DB = db
}
