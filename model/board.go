package model

type Board struct {
	Board  BoardMeta `json:"board"`
	Posts  []Post    `json:"posts"`
	Paging *Paging   `json:"paging,omitempty"`
}

type BoardMeta struct {
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	Summary   string `json:"summary"`
	Timestamp int64  `json:"timestamp"`
}

type Paging struct {
	Previous string `json:"previous,omitempty"`
	Next     string `json:"next,omitempty"`
}
