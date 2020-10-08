package main

import (
	"arkupiec/bazarek/application"
	"arkupiec/bazarek/repository"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"os"
)

func init() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.WarnLevel)
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{Logger: logger.Default.LogMode(logger.Warn)})

	if err != nil {
		panic("failed to connect database")
	}

	repository.CreateSchema(db)
	application.Run(db)
}
