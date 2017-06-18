package local

import (
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/minchao/shurara/storage"
	config "github.com/spf13/viper"
)

func init() {
	storage.Register("local", Plugin)
}

// Plugin returns local storage.
func Plugin(c *config.Viper) (storage.Storage, error) {
	return New(c), nil
}

type Storage struct {
	config *config.Viper
}

// New creates storage.
func New(c *config.Viper) storage.Storage {
	return &Storage{c}
}

// GetBaseURL returns the base path.
func (s *Storage) GetBaseDir() string {
	return s.config.GetString("baseDir")
}

func (s *Storage) GetBaseURL() string {
	return s.config.GetString("baseURL")
}

// Put writes file assets to disk.
func (s *Storage) Put(path string, data []byte) storage.Channel {
	channel := make(storage.Channel, 1)

	go func() {
		var (
			err      error
			result   = storage.Result{}
			fullPath = filepath.Join(s.GetBaseDir(), path)
		)

		toDir := filepath.Dir(fullPath)
		exist, err := isDirExist(toDir)
		if !exist && err == nil {
			err = os.MkdirAll(toDir, 0755)
		}
		if err == nil {
			err = ioutil.WriteFile(fullPath, data, 0644)
		}
		if err != nil {
			result.Err = err
		}

		channel <- result
		close(channel)
	}()

	return channel
}

func isDirExist(path string) (bool, error) {
	fi, err := os.Stat(path)
	if err != nil {
		return false, err
	}
	if !fi.IsDir() {
		return false, errors.New("not dir")
	}
	return true, nil
}
