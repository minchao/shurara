package model

type Board struct {
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	Summary   string `json:"summary"`
	Timestamp int64  `json:"timestamp"`
}
