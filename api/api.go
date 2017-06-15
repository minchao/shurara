package api

import (
	log "github.com/Sirupsen/logrus"
	"github.com/go-playground/form"
	"github.com/gorilla/mux"
	"github.com/minchao/shurara/app"
	"github.com/rs/cors"
	config "github.com/spf13/viper"
	"github.com/urfave/negroni"
)

var decoder = form.NewDecoder()

type Server struct {
	app *app.Server
}

func Init(app *app.Server) {
	log.Debug("api.Init")

	server := Server{app: app}
	server.init()
}

func (s *Server) init() {
	router := mux.NewRouter().PathPrefix("/api").Subrouter().StrictSlash(true)
	router.HandleFunc("/", ok).Methods("GET")
	router.HandleFunc("/boards/{board_id:[A-Za-z0-9]+}", s.getBoard).Methods("GET")
	router.HandleFunc("/boards/{board_id:[A-Za-z0-9]+}/posts", s.postBoardPost).Methods("POST")

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

	s.app.Router.PathPrefix("/api").Handler(n)
}
