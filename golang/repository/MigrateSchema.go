package repository

import "arkupiec/bazarek/model"
import "gorm.io/gorm"

func CreateSchema() {
	// CreateSchema the schema
	db.AutoMigrate(&model.Bazarek{})
	db.AutoMigrate(&model.Steam{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Tag{})
}
