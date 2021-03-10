package scraper

import (
	"encoding/json"
)

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
	ID              json.Number `json:"id"`
	Title           string      `json:"title"`
	Mean            json.Number `json:"mean"`
	Rank            json.Number `json:"rank"`
	Popularity      json.Number `json:"popularity"`
	NumScoringUsers json.Number `json:"num_scoring_users"`
	MediaType       string      `json:"media_type"`
	Status          string      `json:"status"`
	Genre           []Genre     `json:"genres"`
	NumEpisodes     json.Number `json:"num_episodes"`
	StartSeason     Season      `json:"start_season"`
	Source          string      `json:"source"`
	// ignored
	// MainPicture     map[string]string `json:"main_picture"`
}

// Paging indicates position of dataframe
type Paging struct {
	Previous string `json:"previous"`
	Next     string `json:"next"`
}

// DataNode contains data given by myanimelist api
type DataNode struct {
	Node Anime `json:"node"`
}

// APIResponse given by myanimelist api
type APIResponse struct {
	Data   []DataNode `json:"data"`
	Paging Paging     `json:"paging"`
	Season Season     `json:"season"`
}

// ErrorResponse indicates api request failed
type ErrorResponse struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}
