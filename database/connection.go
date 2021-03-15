package database

import (
	"os"
)

// NewDatabase creates a connection to a db instance from env
func NewDatabase() *Database {
	meta := &Meta{
		Host: os.Getenv("DB_HOST"),
		Port: os.Getenv("DB_PORT"),
		User: os.Getenv("DB_USER"),
		Pass: os.Getenv("DB_PASS"),
		Name: os.Getenv("DB_NAME"),
	}

	db := &Database{}
	db.Connect(meta)

	return db
}
