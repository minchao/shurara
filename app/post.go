package app

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/minchao/shurara/model"
)

func (s *Server) GetPostList(boardId string, limit int, since, until int64) (*model.PostList, *model.AppError) {
	if limit == 0 {
		limit = 20
	}

	boardResult := <-s.Store.Board().Get(boardId)
	if boardResult.Err != nil {
		return nil, boardResult.Err.SetStatusCode(http.StatusNotFound)
	}
	postsResult := <-s.Store.Post().Search(boardId, limit, since, until)
	if postsResult.Err != nil {
		return nil, postsResult.Err
	}

	postList := &model.PostList{
		Board:  *boardResult.Data.(*model.Board),
		Posts:  postsResult.Data.([]*model.Post),
		Paging: model.Paging{},
	}

	if len(postList.Posts) > 0 {
		// Paging
		since := postList.Posts[0].Timestamp
		until := postList.Posts[len(postList.Posts)-1].Timestamp

		u, _ := url.Parse(fmt.Sprintf("/api/boards/%s", boardId))
		values := url.Values{}
		values.Set("limit", strconv.Itoa(limit))

		prevCh := s.Store.Post().Search(boardId, limit, since, 0)
		nextCh := s.Store.Post().Search(boardId, limit, 0, until)
		if postsResult := <-prevCh; postsResult.Err == nil && len(postsResult.Data.([]*model.Post)) > 0 {
			values.Set("since", strconv.FormatInt(since, 10))
			u.RawQuery = values.Encode()

			postList.Paging.Previous = u.String()
		}
		if postsResult := <-nextCh; postsResult.Err == nil && len(postsResult.Data.([]*model.Post)) > 0 {
			values.Set("until", strconv.FormatInt(until, 10))
			u.RawQuery = values.Encode()

			postList.Paging.Next = u.String()
		}
	}

	return postList, nil
}

func (s *Server) CreatePost() (*model.Post, *model.AppError) {
	// TODO
	return nil, nil
}
