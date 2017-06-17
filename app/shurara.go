package app

import (
	"fmt"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/minchao/shurara/store"
	config "github.com/spf13/viper"
	"github.com/urfave/negroni"
)

type Server struct {
	Store  store.Store
	Router *mux.Router
}

// New creates shurara server.
func New() *Server {
	storeName := config.GetString("store.name")
	fn, ok := store.Factories[storeName]
	if !ok {
		log.Fatalf("store factory '%s' not found", storeName)
	}
	s, err := fn(config.Sub(fmt.Sprintf("store.%s", storeName)))
	if err != nil {
		log.Fatalf("store init failure:", err)
	}
	log.Debugf("Store: %s", storeName)

	return &Server{
		Store:  s,
		Router: mux.NewRouter().StrictSlash(true),
	}
}

func (s *Server) Run() {
	var (
		addr = config.GetString("http.addr")
		dist = "./webapp/dist"
	)

	// Serving static files
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
