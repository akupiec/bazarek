package repository

import "arkupiec/bazarek_updater/model"
import "gorm.io/gorm"

func CreateSchema(db *gorm.DB) {
	// CreateSchema the schema
	db.AutoMigrate(&model.Bazarek{})
	db.AutoMigrate(&model.Steam{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Tag{})
	db.AutoMigrate(&model.Review{})
}
