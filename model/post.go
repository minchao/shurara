package model

import "time"

type Post struct {
	Id        string     `json:"id"`
	User      User       `json:"user"`
	Type      string     `json:"type"`
	Timestamp int64      `json:"timestamp"`
	Body      string     `json:"body"`
	Comments  []*Comment `json:"comments"`
	Images    []*Image   `json:"images"`
}

func NewPost(user User, t, body string) *Post {
	return &Post{
		User:      user,
		Type:      t,
		Timestamp: time.Now().UnixNano() / int64(time.Millisecond),
		Body:      body,
		Comments:  []*Comment{},
		Images:    []*Image{},
	}
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

type Paging struct {
	Previous string `json:"previous,omitempty"`
	Next     string `json:"next,omitempty"`
}

type PostList struct {
	Board  Board   `json:"board"`
	Posts  []*Post `json:"posts"`
	Paging Paging  `json:"paging,omitempty"`
}

func NewPostList(board Board) *PostList {
	return &PostList{
		Board:  board,
		Posts:  []*Post{},
		Paging: Paging{},
	}
}
