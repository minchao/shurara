package api

import (
	"mime/multipart"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
)

func (s *Server) getBoard(w http.ResponseWriter, r *http.Request) {
	render(w, http.StatusOK, nil)
}

type boardPost struct {
	Name    string `form:"name"`
	Content string `form:"content"`
}

type boardPostResult struct {
}

func (s *Server) postBoardPost(w http.ResponseWriter, r *http.Request) {
	var (
		vars    = mux.Vars(r)
		boardId string
		post    boardPost
		file    multipart.File
		//header *multipart.FileHeader
	)

	boardId, _ = vars["board_id"]
	r.ParseMultipartForm(32 << 20)
	decoder.Decode(&post, r.Form)

	_, hasPhone := r.MultipartForm.File["photo"]
	if len(post.Content) == 0 && !hasPhone {
		render(w, http.StatusBadRequest, errorMessage{Error: "bad_request"})
	}
	if hasPhone {
		var err error
		file, _, err = r.FormFile("photo")
		if err != nil {
			render(w, http.StatusBadRequest, errorMessage{Error: "bad_request"})
			return
		}
		defer file.Close()
	}

	log.Debugf("boardId: %s, name: %s, content: %s",
		boardId,
		post.Name,
		post.Content)

	render(w, http.StatusOK, boardPostResult{})
}