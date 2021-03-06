package api

import (
	"net/http"

	"github.com/minchao/shurara/internal/app/shurara/model"

	"github.com/go-playground/form"
	"github.com/gorilla/mux"
	"gopkg.in/go-playground/validator.v9"
)

type commentReq struct {
	Name string `form:"name"`
	Body string `form:"body" validate:"required"`
}

func (s *Server) postComment(w http.ResponseWriter, r *http.Request) {
	var (
		vars    = mux.Vars(r)
		boardId string
		postId  string
		req     commentReq
	)

	boardId, _ = vars["board_id"]
	postId, _ = vars["post_id"]
	r.ParseMultipartForm(32 << 20)
	if err := form.NewDecoder().Decode(&req, r.Form); err != nil {
		renderAppError(w, model.NewAppError("api.comment.post.bad_request", err.Error()).
			SetStatusCode(http.StatusBadRequest))
	}
	if err := validator.New().Struct(&req); err != nil {
		renderAppError(w, model.NewAppError("api.comment.post.bad_request", err.Error()).
			SetStatusCode(http.StatusBadRequest))
		return
	}

	if req.Name == "" {
		req.Name = "Anonymous"
	}

	post, err := s.app.CreateComment(
		boardId,
		postId,
		model.NewComment(model.User{Id: "tester", Name: req.Name}, req.Body),
	)
	if err != nil {
		renderAppError(w, err.SetStatusCode(http.StatusInternalServerError))
	}

	render(w, http.StatusOK, post)
}
