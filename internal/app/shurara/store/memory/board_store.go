package memory

import (
	"github.com/minchao/shurara/internal/app/shurara/model"
	"github.com/minchao/shurara/internal/app/shurara/store"
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

		boardWrap, err := s.store.get(id)
		if err != nil {
			result.Err = model.NewAppError("store.board.get.error", err.Error())
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
