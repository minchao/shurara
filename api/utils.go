package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"strings"

	"gopkg.in/go-playground/validator.v9"
)

type errorMessage struct {
	Error            string      `json:"error"`
	ErrorDescription interface{} `json:"error_description,omitempty"`
}

func formErrorMessage(err error) errorMessage {
	var (
		e           string = "bad_request"
		description interface{}
	)
	switch err.(type) {
	case validator.ValidationErrors:
		errors := map[string]interface{}{}
		for _, v := range err.(validator.ValidationErrors) {
			errors[v.Field()] = fmt.Sprintf("Invalid validation on tag: %s", v.Tag())
		}
		description = errors
	default:
		description = err.Error()
	}
	return errorMessage{Error: e, ErrorDescription: description}
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
