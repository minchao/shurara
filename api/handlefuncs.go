package api

import "net/http"

func ok(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Ok bool `json:"ok"`
	}{
		Ok: true,
	}

	render(w, http.StatusOK, data)
}

func postPost(w http.ResponseWriter, r *http.Request) {
	render(w, http.StatusOK, nil)
}
