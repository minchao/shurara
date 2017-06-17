package api

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"net/url"
	"strconv"

	log "github.com/Sirupsen/logrus"
	"github.com/go-playground/form"
	"github.com/gorilla/mux"
	"github.com/minchao/shurara/model"
)

type postListReq struct {
	Since int64 `json:"since" form:"since" validate:"omitempty"`
	Until int64 `json:"until" form:"until" validate:"omitempty"`
	Limit int   `json:"limit" form:"limit" validate:"omitempty,gt=0"`
}

func (s *Server) getPostList(w http.ResponseWriter, r *http.Request) {
	var (
		vars     = mux.Vars(r)
		req      postListReq
		postList model.PostList
	)

	if err := form.NewDecoder().Decode(&req, r.URL.Query()); err != nil {
		render(w, http.StatusBadRequest, errorMessage{Error: "bad_request", ErrorDescription: err.Error()})
		return
	}
	validate := NewValidate()
	if err := validate.Struct(req); err != nil {
		render(w, http.StatusBadRequest, formErrorMessage(err))
		return
	}

	boardId, _ := vars["board_id"]
	if req.Limit == 0 {
		req.Limit = 20
	}

	boardResult := <-s.app.Store.Board().Get(boardId)
	if boardResult.Err != nil {
		render(w, http.StatusBadRequest, errorMessage{Error: "not_found"})
		return
	}
	postsResult := <-s.app.Store.Post().Search(boardId, req.Limit, req.Since, req.Until)
	if postsResult.Err != nil {
		render(w, http.StatusInternalServerError, errorMessage{Error: "Internal_server_error"})
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
		vars    = mux.Vars(r)
		boardId string
		post    postReq
		file    multipart.File
		//header *multipart.FileHeader
	)

	boardId, _ = vars["board_id"]
	r.ParseMultipartForm(32 << 20)
	decoder.Decode(&post, r.Form)

	_, hasImage := r.MultipartForm.File["image"]
	if len(post.Body) == 0 && !hasImage {
		render(w, http.StatusBadRequest, errorMessage{Error: "bad_request"})
		return
	}
	if hasImage {
		var err error
		file, _, err = r.FormFile("image")
		if err != nil {
			render(w, http.StatusBadRequest, errorMessage{Error: "bad_request"})
			return
		}
		defer file.Close()
	}

	log.Debugf("boardId: %s, name: %s, content: %s",
		boardId,
		post.Name,
		post.Body)

	result := <-s.app.Store.Post().Save(
		boardId,
		model.NewPost(
			model.User{Id: "tester", Name: "Tester"},
			"text",
			post.Body,
		),
	)
	if result.Err != nil {
		log.Errorln(result.Err)

		render(w, http.StatusInternalServerError, errorMessage{Error: "Internal_server_error"})
		return
	}

	render(w, http.StatusOK, result.Data.(*model.Post))
}
