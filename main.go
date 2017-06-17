package main

import (
	"github.com/minchao/shurara/cmd"
	_ "github.com/minchao/shurara/store/memory"
)

func main() {
	cmd.Execute()
}
