package app

import (
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	config "github.com/spf13/viper"
	"github.com/urfave/negroni"
)

type Server struct {
}

// New creates shurara server.
func New() *Server {
	return &Server{}
}

func (s *Server) Run() {
	var (
		addr   = config.GetString("http.addr")
		dist   = "./webapp/dist"
		router *mux.Router
	)

	// Serving static files
	dir := http.Dir(dist)
	f, err := dir.Open("index.html")
	if err != nil {
		logrus.Fatalf("The '%s' directory not found", dist)
	}
	f.Close()

	router = mux.NewRouter().StrictSlash(true)
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(dir)))

	n := negroni.New()
	n.UseHandler(router)

	logrus.Infof("Listening for HTTP on %s", addr)
	logrus.Fatal(http.ListenAndServe(addr, n))
}
