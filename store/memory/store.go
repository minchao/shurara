package memory

import (
	"sync"
	"time"

	"github.com/minchao/shurara/model"
	"github.com/minchao/shurara/store"
	"github.com/spf13/viper"
)

func init() {
	store.Register("memory", Plugin)
}

// Plugin returns memory store.
func Plugin(_ *viper.Viper) (store.Store, error) {
	return New(), nil
}

type Store struct {
	board store.BoardStore
	post  store.PostStore

	database map[string]*boardWrap
	sync.Mutex
}

// New creates store.
func New() store.Store {
	s := &Store{}
	s.board = NewBoardStore(s)
	s.post = NewPostStore(s)
	s.database = make(map[string]*boardWrap)
	s.database["default"] = newBoardWrap(
		model.Board{
			Name:      "Default",
			Slug:      "default",
			Summary:   "Description ...",
			Timestamp: time.Now().UnixNano() / int64(time.Millisecond),
		},
	)
	return s
}

func (s *Store) Board() store.BoardStore {
	return s.board
}

func (s *Store) Post() store.PostStore {
	return s.post
}

func (s *Store) create(board *model.Board) {
	s.Lock()
	defer s.Unlock()
	s.database[board.Slug] = newBoardWrap(*board)
}

func (s *Store) get(boardId string) *boardWrap {
	s.Lock()
	defer s.Unlock()
	return s.database[boardId]
}

type board struct {
	board model.Board
	posts []*model.Post
}

type boardWrap struct {
	board board
	sync.RWMutex
}

func newBoardWrap(b model.Board) *boardWrap {
	return &boardWrap{
		board: board{
			board: b,
			posts: []*model.Post{},
		},
	}
}
