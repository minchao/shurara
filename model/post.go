package model

import "time"

const (
	PostTypeText  = "text"
	PostTypeImage = "image"
)

type Post struct {
	Id        string     `json:"id"`
	User      User       `json:"user"`
	Type      string     `json:"type"`
	Timestamp int64      `json:"timestamp"`
	Body      string     `json:"body"`
	Comments  []*Comment `json:"comments"`
	Images    []*Image   `json:"images"`
}

func NewPost(user User, body string) *Post {
	return &Post{
		User:      user,
		Type:      PostTypeText,
		Timestamp: time.Now().UnixNano() / int64(time.Millisecond),
		Body:      body,
		Comments:  []*Comment{},
		Images:    []*Image{},
	}
}

func (p *Post) AddComment(comment *Comment) *Post {
	p.Comments = append(p.Comments, comment)
	return p
}

func (p *Post) AddImage(image *Image) *Post {
	p.Images = append(p.Images, image)
	return p
}

type Image struct {
	Original   ImageOriginal     `json:"original"`
	Thumbnails []*ImageThumbnail `json:"thumbnails"`
}

func NewImage(original ImageOriginal) *Image {
	return &Image{
		Original:   original,
		Thumbnails: []*ImageThumbnail{},
	}
}

func (i *Image) AddThumbnail(thumbnail *ImageThumbnail) *Image {
	i.Thumbnails = append(i.Thumbnails, thumbnail)
	return i
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

type ImageThumbnailByWidth []*ImageThumbnail

func (t ImageThumbnailByWidth) Len() int           { return len(t) }
func (t ImageThumbnailByWidth) Swap(i, j int)      { t[i], t[j] = t[j], t[i] }
func (t ImageThumbnailByWidth) Less(i, j int) bool { return t[i].Width < t[j].Width }

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
