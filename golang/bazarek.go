package main

import (
	"arkupiec/bazarek/application"
	"arkupiec/bazarek/repository"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"os"
	"time"
)

func init() {
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.DebugLevel)
}

func main() {
	newLogger := logger.New(
		logrus.New(),
		logger.Config{
			SlowThreshold: time.Millisecond * 500, // Slow SQL threshold
			LogLevel:      logger.Info,            // Log level
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
