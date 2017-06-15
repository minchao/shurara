package model

type Post struct {
	Id        string    `json:"id"`
	User      User      `json:"user"`
	Type      string    `json:"type"`
	Timestamp int64     `json:"timestamp"`
	Body      string    `json:"body"`
	Comments  []Comment `json:"comments"`
	Photos    []Photo   `json:"photos"`
}

type Photo struct {
	Original   PhotoOriginal     `json:"original"`
	Thumbnails []*PhotoThumbnail `json:"thumbnails"`
}

type PhotoOriginal struct {
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type PhotoThumbnail struct {
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type Comment struct {
	Type      string `json:"type"`
	Timestamp int64  `json:"timestamp"`
	User      User   `json:"user"`
	Body      string `json:"body"`
}
