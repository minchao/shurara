package model

import "time"

type Comment struct {
	Type      string `json:"type"`
	Timestamp int64  `json:"timestamp"`
	User      User   `json:"user"`
	Body      string `json:"body"`
}

func NewComment(user User, body string) *Comment {
	return &Comment{
		Type:      PostTypeText,
		Timestamp: time.Now().UnixNano() / int64(time.Millisecond),
		User:      user,
		Body:      body,
	}
}
