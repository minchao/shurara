package model

type AppError struct {
	Err            string `json:"error"`
	ErrDescription string `json:"error_description,omitempty"`
	StatusCode     int    `json:"-"`
	Parent         error  `json:"-"`
}

// NewAppError returns AppError.
func NewAppError(err, description string) *AppError {
	return &AppError{
		Err:            err,
		ErrDescription: description,
	}
}

func (e *AppError) Error() string {
	return e.Err + ": " + e.ErrDescription
}

func (e *AppError) SetStatusCode(code int) *AppError {
	e.StatusCode = code
	return e
}

func (e *AppError) SetParent(parent error) *AppError {
	e.Parent = parent
	return e
}
