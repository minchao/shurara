package api

import (
	"io/ioutil"
	"net/http"

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
		vars = mux.Vars(r)
		req  postListReq
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

	postList, err := s.app.GetPostList(boardId, req.Limit, req.Since, req.Until)
	if err != nil {
		renderAppError(w, err)
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
		data     []byte
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

		data, _ = ioutil.ReadAll(file)
	}

	result, err := s.app.CreatePost(boardId, post, data)
	if err != nil {
		renderAppError(w, err.SetStatusCode(http.StatusInternalServerError))
		return
	}

	render(w, http.StatusOK, result)
}
