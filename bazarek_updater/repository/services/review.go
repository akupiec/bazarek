package services

import (
	"arkupiec/bazarek_updater/model"
	"gorm.io/gorm"
)

func getReviewByName(db *gorm.DB, name string) (r model.Review) {
	db.Model(model.Review{}).Where("name = (?)", name).First(&r)
	return r
}
