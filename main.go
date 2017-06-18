package main

import (
	"github.com/minchao/shurara/cmd"
	_ "github.com/minchao/shurara/storage/local"
	_ "github.com/minchao/shurara/store/memory"
)

func main() {
	cmd.Execute()
}
