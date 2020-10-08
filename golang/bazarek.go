package main

import (
	"arkupiec/bazarek/application"
	"arkupiec/bazarek/repository"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
)

func init() {
	log.SetOutput(os.Stdout)
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	repository.CreateSchema(db)
	application.Run(db)
}
