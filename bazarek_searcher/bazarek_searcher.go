package main

import (
	"arkupiec/bazarek_searcher/application"
	"arkupiec/bazarek_searcher/repository"
	"gorm.io/driver/sqlite"
)

func main() {
	d := sqlite.Open("../test.db")
	db := repository.Connect(d)
	repository.CreateSchema()
	application.Host(db)
}
