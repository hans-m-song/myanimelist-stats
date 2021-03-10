package api

import (
	"context"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

var serverLogger = logrus.New().WithField("context", "server")

func handler(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		serverLogger.Warn("received empty code")
		w.WriteHeader(201)
		w.Write([]byte("no code recieved"))
		return
	}

	w.WriteHeader(200)
	w.Write([]byte(code))
	serverLogger.Info("received authorization code")
}

// Listen starts a server to listen for a redirect to localhost:9090
func Listen() string {
	done := make(chan string)

	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		code := r.URL.Query().Get("code")
		if code == "" {
			serverLogger.Warn("received empty code")
			w.WriteHeader(201)
			w.Write([]byte("no code recieved"))
		} else {
			w.WriteHeader(200)
			w.Write([]byte(code))
			serverLogger.Info("received authorization code: " + code[0:5] + "...")
		}
		done <- code
	}).Methods("GET")

	server := &http.Server{
		Addr:    ":9090",
		Handler: router,
	}

	serverLogger.Info("start")

	go func() {
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			serverLogger.Error(err)
		}
	}()

	code := <-done

	err := server.Shutdown(context.Background())
	if err != nil {
		serverLogger.Error(err)
	}

	serverLogger.Info("end")

	return code
}
