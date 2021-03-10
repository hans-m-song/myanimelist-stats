package main

import (
	"fmt"
	"myanimelist-scraper/api"
	"myanimelist-scraper/scraper"

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

	data := scraper.Seasonal(session.AccessToken, 2020, "winter", 2)

	fmt.Println(data)
}
