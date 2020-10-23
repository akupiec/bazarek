package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"gorm.io/gorm/clause"
	"time"
)

func GetOldSteamsEager(t time.Time) []model.Game {
	db := repository.DB
	var results []model.Game
	tx := db.Model(model.Game{})

	tx.Where("(reviews_count IS NULL AND steam_id IS NOT NULL) OR steam_id IN (?)", db.Table("steams as s").Select("s.id").Where("updated < ?", t))

	tx.Preload("Steam").Find(&results)

	return results
}

func saveSteam(steam *model.Steam) {
	db := repository.DB
	steam.Updated = time.Now()
	if steam.Href != "" {
		db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "steam_ref_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"price", "updated"}),
		}).Create(steam)
		if steam.ID == 0 {
			db.Where("steam_ref_id = ?", steam.SteamRefID).First(steam)
		}
		if steam.ID == 0 {
			panic("what do you think you are doing!")
		}
	}
}
