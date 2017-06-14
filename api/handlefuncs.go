package api

import (
	"mime/multipart"
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/go-playground/form"
	"github.com/gorilla/mux"
)

var decoder = form.NewDecoder()

func ok(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Ok bool `json:"ok"`
	}{
		Ok: true,
	}

	render(w, http.StatusOK, data)
}

type boardPost struct {
	Name    string `form:"name"`
	Content string `form:"content"`
}

type boardPostResult struct {
}

func postBoardPost(w http.ResponseWriter, r *http.Request) {
	var (
		vars  = mux.Vars(r)
		board string
		post  boardPost
		file  multipart.File
		//header *multipart.FileHeader
	)

	board, _ = vars["board"]
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

	logrus.Debugf("board: %s, name: %s, content: %s",
		board,
		post.Name,
		post.Content)

	render(w, http.StatusOK, boardPostResult{})
}
