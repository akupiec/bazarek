package repository

import (
	"arkupiec/bazarek/model"
	"gorm.io/gorm"
)

func SaveSteamGame(db *gorm.DB, game *model.Steam) {
	db.Transaction(func(tx *gorm.DB) error {
		for _, t := range game.Tags {
			tx.FirstOrCreate(&t)
		}
		for _, c := range game.Category {
			tx.FirstOrCreate(&c)
		}
		for _, r := range game.Review {
			tx.FirstOrCreate(&r)
		}

		tx.Updates(game)
		return nil
	})
}
