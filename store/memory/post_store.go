package memory

import (
	"time"

	"github.com/minchao/shurara/model"
	"github.com/minchao/shurara/store"
	"github.com/rs/xid"
)

type PostStore struct {
	store *Store
}

func NewPostStore(store *Store) store.PostStore {
	return &PostStore{store}
}

func (s *PostStore) Get(id string) store.Channel {
	channel := make(store.Channel, 1)

	// TODO

	return channel
}

func (s *PostStore) Save(boardId string, post *model.Post) store.Channel {
	channel := make(store.Channel, 1)

	go func() {
		result := store.Result{}

		boardWrap := s.store.get(boardId)
		if boardWrap == nil {
			result.Err = model.NewAppError("store.post.save.error", "Board not found")
		} else {
			boardWrap.Lock()
			defer boardWrap.Unlock()

			post.Id = xid.New().String()

			boardWrap.board.posts = append(boardWrap.board.posts, post)
			result.Data = boardWrap.board.posts[len(boardWrap.board.posts)-1]
		}

		channel <- result
		close(channel)
	}()

	return channel
}

func (s *PostStore) Search(boardId string, limit int, since, until int64) store.Channel {
	channel := make(store.Channel, 1)

	go func() {
		result := store.Result{}

		boardWrap := s.store.get(boardId)
		if boardWrap == nil {
			result.Err = model.NewAppError("store.post.search.error", "Board not found")
		} else {
			boardWrap.RLock()
			defer boardWrap.RUnlock()

			posts := []*model.Post{}
			num := len(boardWrap.board.posts)

			for i := 0; i < num; i++ {
				var (
					post       *model.Post
					postTsTime time.Time
				)

				if since > 0 {
					post = boardWrap.board.posts[i]
					postTsTime = time.Unix(0, post.Timestamp*int64(time.Millisecond))

					if !postTsTime.After(time.Unix(0, since*int64(time.Millisecond))) {
						continue
					}
				} else {
					post = boardWrap.board.posts[num-i-1]
					postTsTime = time.Unix(0, post.Timestamp*int64(time.Millisecond))

					if until > 0 && !postTsTime.Before(time.Unix(0, until*int64(time.Millisecond))) {
						continue
					}
				}

				posts = append(posts, post)

				if len(posts) == limit {
					break
				}
			}

			if since > 0 {
				if num := len(posts); num > 1 {
					for i, j := 0, num-1; i < j; i, j = i+1, j-1 {
						posts[i], posts[j] = posts[j], posts[i]
					}
				}
			}

			result.Data = posts
		}

		channel <- result
		close(channel)
	}()

	return channel
}
