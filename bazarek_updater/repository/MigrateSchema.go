package repository

import (
	"arkupiec/bazarek_updater/model"
	"gorm.io/gorm/clause"
)

func CreateSchema() {
	db := DB
	db.AutoMigrate(&model.Bazarek{})
	db.AutoMigrate(&model.Steam{})
	db.AutoMigrate(&model.Game{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Tag{})
	db.AutoMigrate(&model.Review{})

	tx := db.Begin()
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{1, "Overwhelmingly Negative"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{2, "Very Negative"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{3, "Negative"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{4, "Mostly Negative"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{5, "Mixed"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{6, "Mostly Positive"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{7, "Positive"})
	tx.Clauses(clause.OnConflict{DoNothing: true}).Create(model.Review{8, "Very Positive"})
	tx.Commit()
}
