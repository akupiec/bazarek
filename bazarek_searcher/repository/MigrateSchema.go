package repository

import (
	"arkupiec/bazarek_searcher/model"
)

func CreateSchema() {
	db := DB
	db.AutoMigrate(&model.CustomGame{})
}
