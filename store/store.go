package store

import (
	"fmt"

	log "github.com/Sirupsen/logrus"
	"github.com/minchao/shurara/model"
	config "github.com/spf13/viper"
)

func init() {
	Factories = map[string]Factory{}
}

// Factory is a function that returns store.Store implementation.
type Factory func(cfg *config.Viper) (Store, error)

// Factories is a map where store name matches Factory.
var Factories map[string]Factory

// Register registers the specific Factory.
func Register(name string, fn Factory) {
	Factories[name] = fn
}

func New(name string, cfg *config.Viper) (Store, error) {
	fn, ok := Factories[name]
	if !ok {
		return nil, fmt.Errorf("store factory '%s' not found", name)
	}
	s, err := fn(cfg)
	if err != nil {
		return nil, fmt.Errorf("store.init failure: %v", err)
	}
	log.Debugf("store.Init: %s", name)

	return s, nil
}

type Result struct {
	Data interface{}
	Err  *model.AppError
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
