package api

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/sirupsen/logrus"
)

const oauthURL = "https://myanimelist.net/v1/oauth2/"

var apiLogger = logrus.New().WithField("context", "api.auth")

var client = &http.Client{Timeout: 10 * time.Second}

// Session stores authentication details for current session
type Session struct {
	ClientID          string
	ClientSecret      string
	VerificationCode  string
	AuthorizationCode string
	AccessToken       string
	RefreshToken      string
}

type authResponse struct {
	TokenType    string      `json:"token_type"`
	ExpiresIn    json.Number `json:"expires_in"`
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
}

// GetAuthToken gets initial user authenticated token
func (s *Session) GetAuthToken() {
	requestURL := oauthURL +
		"authorize?" +
		"response_type=code" +
		"&client_id=" + s.ClientID +
		"&code_challenge=" + s.VerificationCode +
		"&code_challenge_method=plain"

	apiLogger.Info("Go to the following url and click allow:\n" + requestURL)
	code := Listen()
	s.AuthorizationCode = code
	apiLogger.Info("add the following code as API_ACCESS_TOKEN to your env to skip the auth step next time:\n" + code)
}

// GetSessionTokens gets access and refresh tokens
func (s *Session) GetSessionTokens() {
	requestURL := oauthURL + "token"
	resp, err := http.PostForm(requestURL, url.Values{
		"client_id":     {s.ClientID},
		"client_secret": {s.ClientSecret},
		"code":          {s.AuthorizationCode},
		"code_verifier": {s.VerificationCode},
		"grant_type":    {"authorization_code"},
	})
	if err != nil {
		apiLogger.WithFields(logrus.Fields{
			"status": "GetSessionTokens",
			"step":   "http.Get",
		}).Fatal(err)
	}

	raw, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		apiLogger.WithFields(logrus.Fields{
			"status": "GetSessionTokens",
			"step":   "ioutil.ReadAll",
		}).Fatal(err)
	}

	data := &authResponse{}
	err = json.Unmarshal(raw, data)
	if err != nil {
		apiLogger.WithFields(logrus.Fields{
			"status": "GetSessionTokens",
			"step":   "readResponse",
		}).Fatal(err)
	}

	s.AccessToken = data.AccessToken
	s.RefreshToken = data.RefreshToken
}

// Authorize handles the oauth process
func Authorize() *Session {

	apiLogger.WithField("context", "oath").Info("start")

	session := &Session{}
	session.ClientID = os.Getenv("API_CLIENT_ID")
	session.ClientSecret = os.Getenv("API_CLIENT_SECRET")
	session.VerificationCode = os.Getenv("API_VERIFICATION_CODE")
	accessToken := os.Getenv("API_ACCESS_TOKEN")
	if accessToken != "" {
		apiLogger.Info("using access token from env")
		session.AccessToken = accessToken
		return session
	}

	session.GetAuthToken()
	session.GetSessionTokens()

	apiLogger.WithField("context", "oath").Info("success")

	return session
}
