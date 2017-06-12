package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	var (
		addr string
		dist string = "./webapp/dist"
	)

	flag.StringVar(&addr, "addr", ":8080", "Address")
	flag.Parse()

	dir := http.Dir(dist)
	f, err := dir.Open("index.html")
	if err != nil {
		log.Fatalf("The '%s' directory not found", dist)
	}
	f.Close()
	http.Handle("/", http.FileServer(dir))
	log.Printf("Listening for HTTP on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
