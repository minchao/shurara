package api

import (
	"encoding/json"
	"net/http"
	"net/url"
	"reflect"
	"strings"

	"github.com/minchao/shurara/model"
	"gopkg.in/go-playground/validator.v9"
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
	return render(w, err.StatusCode, err)
}

func renderError(w http.ResponseWriter, statusCode int, description string) error {
	return renderAppError(w, model.NewAppErrorBy(statusCode, description))
}

func ok(w http.ResponseWriter, _ *http.Request) {
	data := struct {
		Ok bool `json:"ok"`
	}{
		Ok: true,
	}

	render(w, http.StatusOK, data)
}

func NewValidate() *validator.Validate {
	validate := validator.New()
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
	return validate
}

func cleanEmptyURLValues(values *url.Values) {
	for k := range *values {
		if values.Get(k) == "" {
			delete(*values, k)
		}
	}
}
