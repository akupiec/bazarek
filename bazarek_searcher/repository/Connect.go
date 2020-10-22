package repository

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"time"
)

var DB *gorm.DB

func Connect(d gorm.Dialector) *gorm.DB {
	newLogger := logger.New(
		logrus.New(),
		logger.Config{
			SlowThreshold: time.Millisecond * 500, // Slow SQL threshold
			LogLevel:      logger.Info,            // Log level
			Colorful:      true,                   // Disable color
		},
	)

	db, err := gorm.Open(d, &gorm.Config{Logger: newLogger})
	DB = db

	if err != nil {
		panic("failed to connect database")
	}
	return db
}
