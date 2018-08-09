package app

import (
	"fmt"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/minchao/shurara/storage"
	"github.com/minchao/shurara/store"
	config "github.com/spf13/viper"
	"github.com/urfave/negroni"
)

type Server struct {
	Store   store.Store
	Storage storage.Storage
	Router  *mux.Router
}

// New creates shurara server.
func New() *Server {
	return &Server{
		Router: mux.NewRouter().StrictSlash(true),
	}
}

func (s *Server) Run() {
	var (
		err  error
		addr = config.GetString("http.addr")
		dist = "./web/dist"
	)

	storeName := config.GetString("store.name")
	s.Store, err = store.New(storeName, config.Sub(fmt.Sprintf("store.%s", storeName)))
	if err != nil {
		log.Fatal(err)
	}
	storageName := config.GetString("storage.name")
	s.Storage, err = storage.New(storageName, config.Sub(fmt.Sprintf("storage.%s", storageName)))
	if err != nil {
		log.Fatal(err)
	}

	// Serving static files
	if config.GetString("storage.name") == "local" {
		s.Router.PathPrefix("/images/").Handler(http.StripPrefix(
			"/images/",
			http.FileServer(http.Dir(config.GetString("storage.local.baseDir")))))
	}

	dir := http.Dir(dist)
	f, err := dir.Open("index.html")
	if err != nil {
		log.Fatalf("The '%s' directory not found", dist)
	}
	f.Close()
	s.Router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(dir)))

	n := negroni.New()
	n.UseHandler(s.Router)

	log.Infof("Listening for HTTP on %s", addr)
	log.Fatal(http.ListenAndServe(addr, n))
}
