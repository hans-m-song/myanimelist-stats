package main

import (
	"myanimelist-stats/api"
	"myanimelist-stats/database"
	"myanimelist-stats/scraper"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		logger.Fatal(err)
	}

	session := api.Authorize()
	db := database.NewDatabase()
	defer db.Close()

	data := scraper.Seasonal(session.AccessToken, 2020, "winter", 1)

	db.AddAnime(data.Data[0].Node)
}
