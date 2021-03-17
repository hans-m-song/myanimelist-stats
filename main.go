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
	logger.SetLevel(logrus.DebugLevel)

	err := godotenv.Load(".env")
	if err != nil {
		logger.Fatal(err)
	}

	session := api.Authorize()
	db := database.NewDatabase()
	defer db.Close()

	years := []int{2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013}
	seasons := []string{"winter", "spring", "summer", "fall"}

	for _, year := range years {
		for _, season := range seasons {
			logger.Info("downloading data for period ", year, " ", season)
			data := scraper.Seasonal(session.AccessToken, year, season)

			for _, node := range data {
				db.AddAnime(node.Node)
			}
		}
	}
}
