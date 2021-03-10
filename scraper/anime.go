package scraper

import (
	"encoding/json"
	"fmt"
	"myanimelist-scraper/api"
	"net/http"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

const endpoint = "https://api.myanimelist.net/v2"

var scraperLogger = logrus.New().WithField("context", "scraper")

// Season aired
type Season struct {
	Year   json.Number `json:"year"`
	Season string      `json:"season"`
}

// Genre of anime
type Genre struct {
	ID   json.Number `json:"id"`
	Name string      `json:"name"`
}

// Anime data type
type Anime struct {
	ID              string            `json:"id"`
	Title           string            `json:"title"`
	MainPicture     map[string]string `json:"main_picture"`
	StartDate       string            `json:"start_date"`
	EndDate         string            `json:"end_date"`
	Mean            json.Number       `json:"mean"`
	Rank            json.Number       `json:"rank"`
	Popularity      json.Number       `json:"popularity"`
	NumScoringUsers json.Number       `json:"num_scoring_users"`
	MediaType       string            `json:"media_type"`
	Status          string            `json:"status"`
	Genre           []Genre           `json:"genres"`
	NumEpisodes     json.Number       `json:"num_episodes"`
	StartSeason     Season            `json:"start_season"`
	Source          string            `json:"source"`
}

// APIResponse given by myanimelist api
type APIResponse struct {
	Data   []Anime           `json:"data"`
	Paging map[string]string `json:"paging"`
	Season Season            `json:"season"`
}

// Seasonal fetches anime by season
func Seasonal(
	accessToken string,
	year int,
	season string,
	limit int,
) []Anime {
	fields := []string{
		"id",
		"title",
		"start_date",
		"end_date",
		"mean",
		"rank",
		"popularity",
		"num_scoring_users",
		"media_type",
		"status",
		"genres",
		"num_episodes",
		"start_season",
		"source",
		"statistics",
	}

	query := "fields=" + strings.Join(fields, ",")

	url := fmt.Sprintf("%s/%s/%s?%s", endpoint, strconv.Itoa(year), season, query)
	scraperLogger.WithField("url", url).Info("requesting seasonal endpoint")

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		scraperLogger.Fatal(err)
	}

	req.Header.Add("Authorization", "Bearer "+accessToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		scraperLogger.Fatal(err)
	}

	parsed := &APIResponse{}
	api.ParseResponse(resp, parsed)

	fmt.Println(parsed)

	return parsed.Data
}
