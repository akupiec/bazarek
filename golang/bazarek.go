package main

import (
	"arkupiec/bazarek/application"
	"arkupiec/bazarek/repository"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	repository.CreateSchema(db)
	application.Run(db)
}
