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

	db.Exec("INSERT INTO reviews (id, name) VALUES (1, 'Overwhelmingly Negative');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (2, 'Very Negative');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (3, 'Negative');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (4, 'Mostly Negative');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (5, 'Mixed');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (6, 'Mostly Positive');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (7, 'Positive');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (8, 'Very Positive');")
	db.Exec("INSERT INTO reviews (id, name) VALUES (9, 'Overwhelmingly Positive');")
}
