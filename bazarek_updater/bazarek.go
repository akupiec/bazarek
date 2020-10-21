package main

import (
	"arkupiec/bazarek_updater/application"
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
	application.Run()
}
