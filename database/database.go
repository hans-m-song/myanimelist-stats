package database

import (
	"context"
	"fmt"
	"myanimelist-stats/scraper"
	"regexp"
	"strings"

	"github.com/jackc/pgx/v4"
	"github.com/sirupsen/logrus"
)

var sanitiser = regexp.MustCompile(`'|,`)

var dbLogger = logrus.New().WithField("context", "db")

// Meta contains information on connecting to the database
type Meta struct {
	Host string
	Port string
	User string
	Pass string
	Name string
}

func sanitise(value string) string {
	result := sanitiser.ReplaceAll([]byte(value), []byte(""))
	return string(result)
}

// Database represents the database
type Database struct {
	Meta
	Conn  *pgx.Conn
	batch *pgx.Batch
}

// Connect creates a connection to a db instance from env
func (db *Database) Connect(meta *Meta) {
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
	db.batch = &pgx.Batch{}
}

// Close disconnects the database
func (db *Database) Close() {
	db.Flush()

	err := db.Conn.Close(context.Background())
	if err != nil {
		dbLogger.Fatal(err)
	}
}

// Flush Dispatches queued batch queries
func (db *Database) Flush() {
	if db.batch != nil {
		dbLogger.Info("flusing ", db.batch.Len(), " actions")
		result := db.Conn.SendBatch(context.Background(), db.batch)
		err := result.Close()
		if err != nil {
			dbLogger.Fatal(err)
		}
	}
}

// AddAnime inserts a record in the db
func (db *Database) AddAnime(anime scraper.Anime) {
	if db.batch == nil {
		db.batch = &pgx.Batch{}
	}

	if i, err := anime.NumEpisodes.Int64(); err != nil || i < 1 {
		return
	}

	if _, err := anime.Mean.Float64(); err != nil {
		return
	}

	logger := dbLogger.WithField("step", "AddAnime")
	logger.Logger.SetLevel(logrus.TraceLevel)

	for _, genre := range anime.Genre {
		db.AddGenre(genre)
	}

	db.AddPeriod(anime.StartSeason)
	genreList := make([]string, len(anime.Genre))
	for i, genre := range anime.Genre {
		genreList[i] = string(genre.ID)
	}
	query := fmt.Sprintf(
		"INSERT INTO anime "+
			"(id, title, mean, rank, popularity, num_scoring_users, media_type, status, genre)"+
			"VALUES (%s, '%s', %s, %s, %s, %s, '%s', '%s', '{%s}')"+
			"ON CONFLICT (id) DO NOTHING",
		anime.ID,
		sanitise(anime.Title),
		anime.Mean,
		anime.Rank,
		anime.Popularity,
		anime.NumScoringUsers,
		anime.MediaType,
		anime.Status,
		strings.Join(genreList, ", "),
	)

	db.batch.Queue(query)

}

// AddPeriod inserts a record in the db
func (db *Database) AddPeriod(period scraper.Period) {
	logger := dbLogger.WithField("step", "AddPeriod")
	logger.Logger.SetLevel(logrus.TraceLevel)

	_, err := db.Conn.Exec(context.Background(),
		fmt.Sprintf(
			"INSERT INTO period (year, season)"+
				"VALUES (%s, '%s')"+
				"ON CONFLICT (year, season) DO NOTHING",
			period.Year,
			period.Season,
		),
	)

	if err != nil {
		logger.Fatal(err)
	}
}

// AddGenre inserts a record in the db
func (db *Database) AddGenre(genre scraper.Genre) {
	logger := dbLogger.WithField("step", "AddGenre")
	logger.Logger.SetLevel(logrus.TraceLevel)

	_, err := db.Conn.Exec(
		context.Background(),
		fmt.Sprintf(
			"INSERT INTO genre (id, name)"+
				"VALUES (%s, '%s')"+
				"ON CONFLICT (id) DO NOTHING",
			genre.ID,
			sanitise(genre.Name),
		),
	)

	if err != nil {
		logger.Fatal(err)
	}
}
