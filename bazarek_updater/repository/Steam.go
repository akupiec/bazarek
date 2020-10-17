package repository

import (
	"arkupiec/bazarek_updater/model"
	"gorm.io/gorm"
)

func SaveSteamGame(db *gorm.DB, game *model.Steam) {
	db.Transaction(func(tx *gorm.DB) error {
		for i, t := range game.Tags {
			tx.FirstOrCreate(&t, t)
			game.Tags[i] = t
		}
		for i, c := range game.Category {
			tx.FirstOrCreate(&c, c)
			game.Category[i] = c
		}
		for i, r := range game.Review {
			tx.FirstOrCreate(&r, r)
			game.Review[i] = r
		}
		tx.Exec("DELETE FROM steam_review WHERE steam_id = (?)", game.ID)
		tx.Exec("DELETE FROM steam_tag WHERE steam_id = (?)", game.ID)
		tx.Exec("DELETE FROM steam_category WHERE steam_id = (?)", game.ID)
		tx.Updates(game)
		return nil
	})
}