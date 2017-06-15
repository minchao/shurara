package api

import (
	"encoding/json"
	"net/http"
)

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

func ok(w http.ResponseWriter, _ *http.Request) {
	data := struct {
		Ok bool `json:"ok"`
	}{
		Ok: true,
	}

	render(w, http.StatusOK, data)
}
