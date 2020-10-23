package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"gorm.io/gorm/clause"
	"time"
)

func HaveOldBazareks(t time.Time) bool {
	db := repository.DB
	var needUpdate int64
	var total int64
	db.Model(&model.Bazarek{}).Where("updated < ?", t).Count(&needUpdate)
	db.Model(&model.Bazarek{}).Where("1=1").Count(&total)
	return needUpdate > 0 || total == 0
}

func BazarekCleanupOld() {
	db := repository.DB
	db.Model(&model.Bazarek{}).Where("1 = 1").Updates(map[string]interface{}{"price": "0", "offers": 0, "updated": time.Now()})
}

func saveBazarek(bazarek *model.Bazarek) {
	db := repository.DB
	bazarek.Updated = time.Now()

	db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "bazarek_ref_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"price", "offers", "updated"}),
	}).Create(&bazarek)

	if bazarek.ID == 0 {
		db.Model(model.Bazarek{}).Where("bazarek_ref_id = (?)", bazarek.BazarekRefID).First(&bazarek)
	}
}

func BazarekCleanUpIncomplete() {
	//db := repository.DB
	//db.Where("offers = 0").Delete(&model.Bazarek{})
}
