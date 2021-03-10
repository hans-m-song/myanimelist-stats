package api

import (
	"encoding/json"
	"net/http"
)

// ParseResponse converts response into json
func ParseResponse(resp *http.Response, target interface{}) error {
	defer resp.Body.Close()

	err := json.NewDecoder(resp.Body).Decode(target)

	return err
}
