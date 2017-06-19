package model

import "net/http"

type AppError struct {
	Err            string `json:"error"`
	ErrDescription string `json:"error_description,omitempty"`
	StatusCode     int    `json:"-"`
	Parent         error  `json:"-"`
}

func (e *AppError) Error() string {
	return e.Err + ": " + e.ErrDescription
}

// NewAppError returns AppError.
func NewAppError(err, description string, statusCode int, parent error) *AppError {
	return &AppError{
		Err:            err,
		ErrDescription: description,
		StatusCode:     statusCode,
		Parent:         parent,
	}
}

// NewAppErrorBy returns AppError from status code and error description.
func NewAppErrorBy(statusCode int, description string) *AppError {
	return &AppError{
		Err:            http.StatusText(statusCode),
		ErrDescription: description,
		StatusCode:     statusCode,
	}
}
