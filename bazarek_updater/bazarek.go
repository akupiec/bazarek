package main

import (
	"arkupiec/bazarek_updater/application/server"
	"arkupiec/bazarek_updater/application/update"
	"arkupiec/bazarek_updater/repository"
	"github.com/sirupsen/logrus"
	"os"
)

func init() {
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.InfoLevel)
}

func main() {
	repository.Connect()
	repository.CreateSchema()

	update.Update()
	server.Host()

}
