package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func createTagAndCateory(games []model.Game) {
	db := repository.DB
	tx := db.Begin()
	for _, g := range games {
		for _, t := range g.Tags {
			tx.Clauses(clause.OnConflict{DoNothing: true}).Create(&t)
		}
		for _, c := range g.Category {
			tx.Clauses(clause.OnConflict{DoNothing: true}).Create(&c)
		}
	}
	tx.Commit()
}

func saveJoinsTagAndCategory(games []model.Game, tx *gorm.DB) {
	for _, g := range games {
		for _, t := range g.Tags {
			tx.Exec("INSERT OR IGNORE INTO steam_tag (game_id, tag_id) VALUES (? , (?))", g.ID, tx.Table("tags").Select("id").Where("name = ?", t.Name))
		}
		for _, c := range g.Category {
			tx.Exec("INSERT OR IGNORE INTO steam_category (game_id, category_id) VALUES (? , (?))", g.ID, tx.Table("categories").Select("id").Where("name = ?", c.Name))
		}
	}
}
