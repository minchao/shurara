package api

import (
	"encoding/json"
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	config "github.com/spf13/viper"
	"github.com/urfave/negroni"
)

func Init(rootRouter *mux.Router) {
	logrus.Debug("api.Init")

	router := mux.NewRouter().PathPrefix("/api").Subrouter().StrictSlash(true)
	router.HandleFunc("/", ok).Methods("GET")
	router.HandleFunc("/board/{board}/post", postBoardPost).Methods("POST")

	n := negroni.New()

	if config.GetBool("http.api.cors.enable") {
		n.Use(cors.New(cors.Options{
			AllowedOrigins: config.GetStringSlice("http.api.cors.origins"),
			AllowedHeaders: config.GetStringSlice("http.api.cors.headers"),
			AllowedMethods: config.GetStringSlice("http.api.cors.methods"),
			Debug:          config.GetBool("http.api.cors.debug"),
		}))
	}

	n.UseHandler(router)

	rootRouter.PathPrefix("/api").Handler(n)
}

type errorMessage struct {
	Error            string      `json:"error"`
	ErrorDescription interface{} `json:"error_description,omitempty"`
}

func render(w http.ResponseWriter, code int, data interface{}) error {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	if data == nil {
		return nil
	}
	return json.NewEncoder(w).Encode(data)
}
