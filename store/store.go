package store

import (
	"github.com/minchao/shurara/model"
	"github.com/spf13/viper"
)

func init() {
	Factories = map[string]Factory{}
}

// Factory is a function that returns store.Store implementation.
type Factory func(config *viper.Viper) (Store, error)

// Factories is a map where store name matches Factory.
var Factories map[string]Factory

// Register registers the specific Factory.
func Register(name string, fn Factory) {
	Factories[name] = fn
}

type Result struct {
	Data interface{}
	Err  error
}

type Channel chan Result

type Store interface {
	Board() BoardStore
	Post() PostStore
}

type BoardStore interface {
	Get(id string) Channel
	Save(board *model.Board) Channel
}

type PostStore interface {
	Get(id string) Channel
	Save(boardId string, post *model.Post) Channel
	Search(boardId string, limit int, since, until int64) Channel
}
