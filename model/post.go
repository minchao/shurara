package model

type Post struct {
	Id        string    `json:"id"`
	User      User      `json:"user"`
	Type      string    `json:"type"`
	Timestamp int64     `json:"timestamp"`
	Body      string    `json:"body"`
	Comments  []Comment `json:"comments"`
	Images    []Image   `json:"images"`
}

type Image struct {
	Original   ImageOriginal     `json:"original"`
	Thumbnails []*ImageThumbnail `json:"thumbnails"`
}

type ImageOriginal struct {
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type ImageThumbnail struct {
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
