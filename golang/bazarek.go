package main

import (
	"arkupiec/bazarek/application"
	"arkupiec/bazarek/repository"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"os"
	"time"
)

func init() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.WarnLevel)
}

func main() {
	newLogger := logger.New(
		log.New(),
		logger.Config{
			SlowThreshold: time.Millisecond * 500, // Slow SQL threshold
			LogLevel:      logger.Warn,            // Log level
			Colorful:      true,                   // Disable color
		},
	)

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{Logger: newLogger})

	if err != nil {
		panic("failed to connect database")
	}

	repository.CreateSchema(db)
	application.Run(db)
}
