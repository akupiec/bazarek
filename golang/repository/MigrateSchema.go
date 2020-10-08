package repository

import "arkupiec/bazarek/model"
import "gorm.io/gorm"

func CreateSchema(db *gorm.DB) {
	// CreateSchema the schema
	db.AutoMigrate(&model.Bazarek{})
	db.AutoMigrate(&model.Steam{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Tag{})
}