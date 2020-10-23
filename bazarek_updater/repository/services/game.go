package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm/clause"
)

func GetGamesWithMissingSteamsEager() []model.Game {
	db := repository.DB
	var results []model.Game
	db.Model(model.Game{}).Preload("Bazarek").Where("steam_id IS NULL AND bazarek_id IS NOT NULL").Find(&results)
	return results
}

func SaveGame(game *model.Game) {
	db := repository.DB
	if game.Steam != nil && game.Steam.SteamRefID != 0 {
		var steam model.Steam
		steam = *game.Steam
		saveSteam(&steam)
		game.SteamID = &steam.ID
	}

	if game.Bazarek != nil && game.Bazarek.BazarekRefID != 0 {
		saveBazarek(game.Bazarek)
		game.BazarekID = &game.Bazarek.ID
	}

	if game.Review != nil && game.Review.Name != "" {
		r := getReviewByName(db, game.Review.Name)
		game.ReviewID = &r.ID
	}

	//if game.Category != nil && len(game.Category) > 0 {
	//
	//}

	game.Bazarek = nil
	game.Review = nil
	game.Steam = nil
	//game.Category = nil
	//game.Tags = nil

	db.Save(game)
	logrus.Debugf("game id: %d save done!", game.ID)
}

func SaveBulkGamesWithBazareks(games []model.Game) {
	for i, _ := range games {
		b := games[i].Bazarek
		saveBazarek(b)
		games[i].BazarekID = &b.ID
		games[i].Bazarek = nil
	}

	repository.DB.Clauses(clause.OnConflict{DoNothing: true}).Create(&games)
}
