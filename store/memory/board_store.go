package memory

import (
	"github.com/minchao/shurara/model"
	"github.com/minchao/shurara/store"
)

type BoardStore struct {
	store *Store
}

func NewBoardStore(store *Store) store.BoardStore {
	return &BoardStore{store}
}

func (s *BoardStore) Get(id string) store.Channel {
	channel := make(store.Channel, 1)

	go func() {
		result := store.Result{}

		boardWrap := s.store.get(id)
		if boardWrap == nil {
			result.Err = model.NewAppError("store.board.get.error", "Board not found")
		} else {
			result.Data = &boardWrap.board.board
		}

		channel <- result
		close(channel)
	}()

	return channel
}

func (s *BoardStore) Save(board *model.Board) store.Channel {
	channel := make(store.Channel, 1)

	// TODO

	return channel
}
