package scraper

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

const endpoint = "https://api.myanimelist.net/v2"

var scraperLogger = logrus.New().WithField("context", "scraper")

func requestAndParseSeasonal(accessToken string, url string) []DataNode {
	scraperLogger.Logger.SetLevel(logrus.TraceLevel)

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

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		scraperLogger.Fatal(err)
	}

	var errorResponse ErrorResponse
	err = json.Unmarshal(data, &errorResponse)
	if err != nil || errorResponse.Error != "" {
		scraperLogger.Fatal(err, string(data))
	}

	var parsed APIResponse
	err = json.Unmarshal(data, &parsed)
	if err != nil {
		scraperLogger.Fatal(err, string(data))
	}

	scraperLogger.Debug("received ", len(parsed.Data), " entries")

	if parsed.Paging.Next != nil && *parsed.Paging.Next != "" {
		more := requestAndParseSeasonal(accessToken, *parsed.Paging.Next)
		return append(parsed.Data, more...)
	}

	return parsed.Data
}

// Seasonal fetches anime by season
func Seasonal(
	accessToken string,
	year int,
	season string,
) []DataNode {
	scraperLogger.Logger.SetLevel(logrus.TraceLevel)

	fields := []string{
		"id",
		"title",
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

	query := "fields=" + strings.Join(fields, ",") + "&limit=100"

	url := fmt.Sprintf("%s/anime/season/%s/%s?%s", endpoint, strconv.Itoa(year), season, query)
	scraperLogger.Info("requesting seasonal endpoint")

	parsed := requestAndParseSeasonal(accessToken, url)
	scraperLogger.Debug("received ", len(parsed), " total entries")

	return parsed
}
