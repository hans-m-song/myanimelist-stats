package database

import (
	"context"
	"fmt"
	"myanimelist-stats/scraper"
	"strings"

	"github.com/jackc/pgx/v4"
	"github.com/sirupsen/logrus"
)

var dbLogger = logrus.New().WithField("context", "db")

// Meta contains information on connecting to the database
type Meta struct {
	Host string
	Port string
	User string
	Pass string
	Name string
}

// Database represents the database
type Database struct {
	Meta
	Conn *pgx.Conn
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
}

// Close disconnects the database
func (db *Database) Close() {
	err := db.Conn.Close(context.Background())
	if err != nil {
		dbLogger.Fatal(err)
	}
}

// AddAnime inserts a record in the db
func (db *Database) AddAnime(anime scraper.Anime) {
	logger := dbLogger.WithFields(logrus.Fields{
		"step":  "AddAnime",
		"title": anime.Title,
	})
	for _, genre := range anime.Genre {
		db.AddGenre(genre)
	}

	db.AddPeriod(anime.StartSeason)

	var id int
	err := db.Conn.QueryRow(
		context.Background(),
		"SELECT id from anime WHERE id=$1",
		anime.ID,
	).Scan(&id)

	if err != nil {
		if err != pgx.ErrNoRows {
			logger.Fatal(err)
		} else {
			genreList := make([]string, len(anime.Genre))
			for i, genre := range anime.Genre {
				genreList[i] = string(genre.ID)
			}
			cmd, err := db.Conn.Exec(
				context.Background(),
				fmt.Sprintf(
					"INSERT INTO anime (id, title, mean, rank, popularity, num_scoring_users, media_type, status, genre)"+
						"VALUES (%s, '%s', %s, %s, %s, %s, '%s', '%s', '{%s}')",
					anime.ID,
					anime.Title,
					anime.Mean,
					anime.Rank,
					anime.Popularity,
					anime.NumScoringUsers,
					anime.MediaType,
					anime.Status,
					strings.Join(genreList, ", "),
				),
			)

			if err != nil {
				logger.Fatal(err)
			}
			logger.Info(string(cmd))
		}
	}

}

// AddPeriod inserts a record in the db
func (db *Database) AddPeriod(period scraper.Period) {
	logger := dbLogger.WithFields(logrus.Fields{
		"step":   "AddPeriod",
		"year":   period.Year,
		"season": period.Season,
	})

	var id int
	err := db.Conn.QueryRow(
		context.Background(),
		fmt.Sprintf(
			"SELECT id FROM period WHERE year=%s AND season='%s'",
			period.Year,
			period.Season,
		),
	).Scan(&id)

	if err != nil {
		if err != pgx.ErrNoRows {
			logger.Fatal(err)
		} else {
			cmd, err := db.Conn.Exec(context.Background(),
				fmt.Sprintf(
					"INSERT INTO period (year, season)"+
						"VALUES (%s, '%s')",
					period.Year,
					period.Season,
				),
			)

			if err != nil {
				logger.Fatal(err)
			}
			logger.Info(string(cmd))
		}
	}
}

// AddGenre inserts a record in the db
func (db *Database) AddGenre(genre scraper.Genre) {
	logger := dbLogger.WithFields(logrus.Fields{
		"step":  "AddGenre",
		"genre": genre.Name,
	})

	var id int
	err := db.Conn.QueryRow(
		context.Background(),
		fmt.Sprintf(
			"SELECT id FROM genre WHERE name='%s'",
			genre.Name,
		),
	).Scan(&id)

	if err != nil {
		if err != pgx.ErrNoRows {
			logger.Fatal(err)
		} else {
			cmd, err := db.Conn.Exec(
				context.Background(),
				fmt.Sprintf(
					"INSERT INTO genre (id, name)"+
						"VALUES (%s, '%s')",
					genre.ID,
					genre.Name,
				),
			)

			if err != nil {
				logger.Fatal(err)
			}
			logger.Info(string(cmd))
		}
	}
}
