package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"time"
)

func GetOldSteamsEager(t time.Time) []model.Game {
	db := repository.DB
	var results []model.Game
	tx := db.Model(model.Game{})

	tx.Where("(reviews_count IS NULL AND steam_id IS NOT NULL) OR steam_id IN (?)", db.Table("steams as s").Select("s.id").Where("updated < ?", t))

	tx.Preload("Steam").Limit(-1).Find(&results)

	return results
}

func createStems(db *gorm.DB, games []model.Game) {
	tx := db.Begin()
	for i, _ := range games {
		ret := *(games[i]).Steam
		ret.Updated = time.Now()
		tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "steam_ref_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"price", "updated"}),
		}).Create(&ret)
	}
	tx.Commit()
}

func saveSteamTypes(games []model.Game, tx *gorm.DB) {
	for _, g := range games {
		g.Steam.Updated = time.Now()
		tx.Model(model.Steam{}).Where("id = ?", g.Steam.ID).Select("price", "updated", "steam_type").Updates(&(g.Steam))

	}
}
