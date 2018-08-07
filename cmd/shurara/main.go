package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"

	"github.com/minchao/shurara/api"
	"github.com/minchao/shurara/app"
	_ "github.com/minchao/shurara/storage/local"
	_ "github.com/minchao/shurara/store/memory"
)

// main executes the shurara command.
func main() {
	var configFile string
	var debug bool

	var rootCmd = &cobra.Command{
		Use:  "shurara",
		Long: "An image board",
		Run:  rootCmdF,
	}

	rootCmd.PersistentFlags().StringVarP(&configFile, "config", "c", "", "Configuration file path")
	rootCmd.PersistentFlags().BoolVarP(&debug, "debug", "d", false, "Enable debug mode")

	rootCmd.Execute()
}

func rootCmdF(cmd *cobra.Command, args []string) {
	if err := initEnv(cmd); err != nil {
		log.Fatalln(err)
		return
	}

	server := app.New()
	api.Init(server)
	server.Run()
}
