package api

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"

	"github.com/minchao/shurara/internal/app/shurara/model"
)

func render(w http.ResponseWriter, statusCode int, data interface{}) error {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	if data == nil {
		return nil
	}
	return json.NewEncoder(w).Encode(data)
}

func renderAppError(w http.ResponseWriter, err *model.AppError) error {
	if err.StatusCode == 0 {
		err.StatusCode = http.StatusInternalServerError
	}
	return render(w, err.StatusCode, err)
}

func renderError(w http.ResponseWriter, statusCode int, description string) error {
	return render(w, statusCode, &model.AppError{
		Err:            statusCodeToError(statusCode),
		ErrDescription: description,
	})
}

func statusCodeToError(code int) string {
	err := "api." + http.StatusText(code)
	err = strings.ToLower(err)
	err = strings.Replace(err, " ", "_", -1)
	err = strings.Replace(err, "-", "_", -1)
	err = strings.Replace(err, "'", "", -1)
	return err
}

func ok(w http.ResponseWriter, _ *http.Request) {
	data := struct {
		Ok bool `json:"ok"`
	}{
		Ok: true,
	}

	render(w, http.StatusOK, data)
}

func cleanEmptyURLValues(values *url.Values) {
	for k := range *values {
		if values.Get(k) == "" {
			delete(*values, k)
		}
	}
}
