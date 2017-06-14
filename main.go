package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func main() {
	var (
		addr   string
		dist   string = "./webapp/dist"
		router *mux.Router
	)

	flag.StringVar(&addr, "addr", ":8080", "Address")
	flag.Parse()

	// Serving static files
	dir := http.Dir(dist)
	f, err := dir.Open("index.html")
	if err != nil {
		log.Fatalf("The '%s' directory not found", dist)
	}
	f.Close()

	router = mux.NewRouter().StrictSlash(true)
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(dir)))

	n := negroni.New()
	n.UseHandler(router)

	log.Printf("Listening for HTTP on %s", addr)
	log.Fatal(http.ListenAndServe(addr, n))
}
