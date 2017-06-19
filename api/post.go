package api

import (
	"io/ioutil"
	"net/http"
	"net/url"
	"path/filepath"

	"github.com/go-playground/form"
	"github.com/gorilla/mux"
	"github.com/minchao/shurara/model"
	"github.com/satori/go.uuid"
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

		file, header, err := r.FormFile("image")
		if err != nil {
			renderAppError(w, model.NewAppError("api.post.post.bad_request", "Image parsing error").
				SetStatusCode(http.StatusBadRequest))
			return
		}
		defer file.Close()

		filename := uuid.NewV4().String() + filepath.Ext(header.Filename)
		data, _ := ioutil.ReadAll(file)

		if result := <-s.app.Storage.Put(filename, data); result.Err != nil {
			renderAppError(w, result.Err.SetStatusCode(http.StatusInternalServerError))
			return
		}

		base, _ := url.Parse(s.app.Storage.GetBaseURL())
		f, _ := url.Parse(filename)

		image := model.NewImage(model.ImageOriginal{
			URL:    base.ResolveReference(f).String(),
			Width:  0,
			Height: 0,
		})

		post.AddImage(image)
	}

	result := <-s.app.Store.Post().Save(boardId, post)
	if result.Err != nil {
		renderAppError(w, result.Err.SetStatusCode(http.StatusInternalServerError))
		return
	}

	render(w, http.StatusOK, result.Data.(*model.Post))
}
