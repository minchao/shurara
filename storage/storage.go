package storage

import (
	"fmt"

	log "github.com/Sirupsen/logrus"
	config "github.com/spf13/viper"
)

func init() {
	Factories = map[string]Factory{}
}

// Factory is a function that returns storage.Storage implementation.
type Factory func(c *config.Viper) (Storage, error)

// Factories is a map where storage name matches Factory.
var Factories map[string]Factory

// Register registers the specific Factory.
func Register(name string, fn Factory) {
	Factories[name] = fn
}

func New(name string, cfg *config.Viper) (Storage, error) {
	fn, ok := Factories[name]
	if !ok {
		return nil, fmt.Errorf("storage factory '%s' not found", name)
	}
	s, err := fn(cfg)
	if err != nil {
		return nil, fmt.Errorf("storage.init failure: %v", err)
	}
	log.Debugf("storage.Init: %s", name)

	return s, nil
}

type Result struct {
	Data interface{}
	Err  error
}

type Channel chan Result

type Storage interface {
	GetBaseDir() string
	GetBaseURL() string
	Put(path string, data []byte) Channel
}
