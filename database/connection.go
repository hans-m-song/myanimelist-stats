package database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4"
	"github.com/sirupsen/logrus"
)

var dbLogger = logrus.New().WithField("context", "db")

// DatabaseMeta contains information on connecting to the database
type DatabaseMeta struct {
	Host string
	Port string
	User string
	Pass string
	Name string
}

// Database represents the database
type Database struct {
	DatabaseMeta
	Conn *pgx.Conn
}

// Connect creates a connection to a db instance from env
func (db *Database) Connect(meta *DatabaseMeta) {
	target := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s",
		meta.User, meta.Pass, meta.Host, meta.Port, meta.Name)
	dbLogger.WithFields(logrus.Fields{
		"Host": meta.Host,
		"Port": meta.Port,
		"User": meta.User,
		"Pass": meta.Pass,
		"Name": meta.Name,
	}).Info("connecting to database at: " + target)

	conn, err := pgx.Connect(context.Background(), target)
	if err != nil {
		dbLogger.Fatal(err)
	}

	db.Conn = conn
	db.Host = meta.Host
	db.Port = meta.Port
	db.User = meta.User
	db.Pass = meta.Pass
	db.Name = meta.Name
}

// Close disconnects the database
func (db *Database) Close() {
	err := db.Conn.Close(context.Background())
	if err != nil {
		dbLogger.Fatal(err)
	}
}

// Add inserts a record in the db
func (db *Database) Add() {

}

// NewDatabase creates a connection to a db instance from env
func NewDatabase() *Database {
	meta := &DatabaseMeta{
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
