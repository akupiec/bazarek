package repository

import (
	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"os"
	"time"
)

var DB *gorm.DB

func Connect() {
	d := sqlite.Open(getPath())
	newLogger := logger.New(
		logrus.New(),
		logger.Config{
			SlowThreshold: time.Millisecond * 500, // Slow SQL threshold
			LogLevel:      logger.Warn,            // Log level
			Colorful:      true,                   // Disable color
		},
	)

	db, err := gorm.Open(d, &gorm.Config{Logger: newLogger})
	if err != nil {
		panic("failed to connect database")
	}
	DB = db
}

func getPath() string {
	path_dst := os.Getenv("PATH_DSN")
	if path_dst != "" {
		return path_dst
	}
	return "../test.db"
}
