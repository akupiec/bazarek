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

	a := db.Clauses(clause.OnConflict{DoNothing: true}).Create(&bazarek)

	if a.RowsAffected == 0 {
		var ret model.Bazarek
		db.Model(model.Bazarek{}).Where("bazarek_ref_id = (?)", bazarek.BazarekRefID).First(&ret)
		bazarek.ID = ret.ID
		db.Save(bazarek)
	}
}

func BazarekCleanUpIncomplete() {
	//db := repository.DB
	//db.Where("offers = 0").Delete(&model.Bazarek{})
}
