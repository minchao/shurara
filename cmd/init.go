package cmd

import (
	"github.com/Sirupsen/logrus"
	"github.com/spf13/cobra"
	config "github.com/spf13/viper"
)

func initEnv(cmd *cobra.Command) error {
	configFile, err := cmd.Flags().GetString("config")
	if err != nil {
		return err
	}

	// Set up default configs
	config.SetDefault("http.addr", ":8080")
	config.SetDefault("store.name", "memory")
	config.SetDefault("storage.name", "local")
	config.SetDefault("storage.local.baseDir", "./www/images")
	config.SetDefault("storage.local.baseURL", "http://localhost:8080/images")

	if len(configFile) > 0 {
		config.SetConfigFile(configFile)
	} else {
		config.SetConfigName("config")
		config.AddConfigPath(".")
	}
	if err := config.ReadInConfig(); err != nil {
		logrus.Warnf("Unable to read config file: %s", err)
	}

	logrus.Infof("Config path: %s", config.ConfigFileUsed())

	if debug, _ := cmd.Flags().GetBool("debug"); debug {
		logrus.SetLevel(logrus.DebugLevel)
		logrus.Debugln("Running in debug mode")
	}

	return nil
}
