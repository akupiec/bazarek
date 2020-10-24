package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"gorm.io/gorm"
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

func crateBazareks(db *gorm.DB, games []model.Game) {
	tx := db.Begin()
	for i, _ := range games {
		ret := *(games[i]).Bazarek
		ret.Updated = time.Now()
		tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "bazarek_ref_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"price", "offers", "updated"}),
		}).Create(&ret)
	}
	tx.Commit()
}

func BazarekCleanUpIncomplete() {
	//db := repository.DB
	//db.Where("offers = 0").Delete(&model.Bazarek{})
}
