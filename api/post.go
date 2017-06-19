package api

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/go-playground/form"
	"github.com/gorilla/mux"
	"github.com/minchao/shurara/model"
	"gopkg.in/go-playground/validator.v9"
)

type postListReq struct {
	Limit int   `json:"limit" form:"limit" validate:"omitempty,gt=0"`
	Since int64 `json:"since" form:"since" validate:"omitempty"`
	Until int64 `json:"until" form:"until" validate:"omitempty"`
}

func (req *postListReq) isValid() error {
	return validator.New().Struct(req)
}

func (s *Server) getPostList(w http.ResponseWriter, r *http.Request) {
	var (
		vars     = mux.Vars(r)
		req      postListReq
		postList model.PostList
	)

	if err := form.NewDecoder().Decode(&req, r.URL.Query()); err != nil {
		renderAppError(w, model.NewAppError("api.post.list.bad_request", err.Error()).
			SetStatusCode(http.StatusBadRequest))
		return
	}
	if err := req.isValid(); err != nil {
		renderAppError(w, model.NewAppError("api.post.list.bad_request", err.Error()).
			SetStatusCode(http.StatusBadRequest))
		return
	}

	boardId, _ := vars["board_id"]
	if req.Limit == 0 {
		req.Limit = 20
	}

	boardResult := <-s.app.Store.Board().Get(boardId)
	if boardResult.Err != nil {
		renderAppError(w, boardResult.Err.SetStatusCode(http.StatusNotFound))
		return
	}
	postsResult := <-s.app.Store.Post().Search(boardId, req.Limit, req.Since, req.Until)
	if postsResult.Err != nil {
		renderAppError(w, postsResult.Err.SetStatusCode(http.StatusInternalServerError))
		return
	}

	postList = model.PostList{
		Board:  *boardResult.Data.(*model.Board),
		Posts:  postsResult.Data.([]*model.Post),
		Paging: model.Paging{},
	}

	if len(postList.Posts) > 0 {
		// Paging
		since := postList.Posts[0].Timestamp
		until := postList.Posts[len(postList.Posts)-1].Timestamp

		u, _ := url.Parse(fmt.Sprintf("/api/boards/%s", boardId))
		values, _ := form.NewEncoder().Encode(&req)
		cleanEmptyURLValues(&values)

		prevCh := s.app.Store.Post().Search(boardId, req.Limit, since, 0)
		nextCh := s.app.Store.Post().Search(boardId, req.Limit, 0, until)
		if postsResult := <-prevCh; postsResult.Err == nil && len(postsResult.Data.([]*model.Post)) > 0 {
			values.Del("until")
			values.Set("since", strconv.FormatInt(since, 10))
			u.RawQuery = values.Encode()

			postList.Paging.Previous = u.String()
		}
		if postsResult := <-nextCh; postsResult.Err == nil && len(postsResult.Data.([]*model.Post)) > 0 {
			values.Del("since")
			values.Set("until", strconv.FormatInt(until, 10))
			u.RawQuery = values.Encode()

			postList.Paging.Next = u.String()
		}
	}

	render(w, http.StatusOK, postList)
}

type postReq struct {
	Name string `form:"name"`
	Body string `form:"body"`
}

func (s *Server) postPost(w http.ResponseWriter, r *http.Request) {
	var (
		vars     = mux.Vars(r)
		boardId  string
		req      postReq
		post     *model.Post
		hasImage bool
	)

	boardId, _ = vars["board_id"]
	r.ParseMultipartForm(32 << 20)
	form.NewDecoder().Decode(&req, r.Form)

	if r.MultipartForm != nil && r.MultipartForm.File != nil {
		_, hasImage = r.MultipartForm.File["image"]
	}
	if len(req.Body) == 0 && !hasImage {
		renderAppError(w, model.NewAppError("api.post.post.bad_request", "Either body or image is required").
			SetStatusCode(http.StatusBadRequest))
		return
	}

	post = model.NewPost(model.User{Id: "tester", Name: req.Name}, req.Body)

	if hasImage {
		post.Type = model.PostTypeImage

		file, _, err := r.FormFile("image")
		if err != nil {
			renderAppError(w, model.NewAppError("api.post.post.bad_request", "Image parsing error").
				SetStatusCode(http.StatusBadRequest))
			return
		}
		defer file.Close()
	}

	result := <-s.app.Store.Post().Save(boardId, post)
	if result.Err != nil {
		renderAppError(w, result.Err.SetStatusCode(http.StatusInternalServerError))
		return
	}

	render(w, http.StatusOK, result.Data.(*model.Post))
}
