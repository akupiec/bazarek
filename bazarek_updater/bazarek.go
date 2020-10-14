package main

import (
	"arkupiec/bazarek_updater/application"
	"arkupiec/bazarek_updater/repository"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"os"
)

func init() {
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.InfoLevel)
}

func main() {
	d := sqlite.Open("../test.db")
	db := repository.Connect(d)
	repository.CreateSchema(db)
	application.Run(db)
}
