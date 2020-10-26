package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm/clause"
	"time"
)

func GetGamesWithMissingSteamsEager() []model.Game {
	db := repository.DB
	var results []model.Game
	db.Model(model.Game{}).Preload("Bazarek").Where("steam_id IS NULL AND bazarek_id IS NOT NULL").Find(&results)
	return results
}

func SaveGameTagsCategoryReview(toSave chan model.Game) {
	t := time.Now()
	logrus.Info("Start saving Steam specyfic data")
	db := repository.DB
	games := make([]model.Game, 0)
	for g := range toSave {
		games = append(games, g)
	}

	createTagAndCateory(games)

	tx := db.Begin()
	saveJoinsTagAndCategory(games, tx)
	saveSteamTypes(games, tx)

	for i, _ := range games {
		if games[i].Review != nil && games[i].Review.Name != "" && *games[i].ReviewsCount >= 10 {
			tx.Table("games").Where("id = ?", games[i].ID).Update("review_id", db.Table("reviews").Select("id").Where("name == ?", games[i].Review.Name))
		}

		tx2 := tx.Table("games as g").Where("g.id = ?", games[i].ID)
		if games[i].Name != "" {
			tx2.Select("name", "reviews_count").Save(&(games[i]))
		} else {
			tx2.Select("reviews_count").Save(&(games[i]))
		}
	}
	tx.Commit()
	e := time.Since(t)
	logrus.Infof("Saving Game End! %s", e)
}

func SaveGameNameWithBazarek(toSave chan model.Game) {
	t := time.Now()
	logrus.Info("Saving Game bazareks Start!")
	db := repository.DB
	games := make([]model.Game, 0)
	for g := range toSave {
		games = append(games, g)
	}

	crateBazareks(db, games)

	tx := db.Begin()
	for i, _ := range games {
		ret := *(games[i]).Bazarek
		tx.Where("bazarek_ref_id = ?", ret.BazarekRefID).First(&ret)
		games[i].Bazarek.ID = ret.ID
		games[i].BazarekID = &ret.ID
		tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "bazarek_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"name", "bazarek_id"}),
		}).Create(&games[i])
	}
	tx.Commit()
	e := time.Since(t)
	logrus.Infof("Saving Game bazareks End! %s", e)
}

func SaveGameNameWithSteam(toSave chan model.Game) {
	t := time.Now()
	logrus.Info("Saving Game steamsId's Start!")
	db := repository.DB
	games := make([]model.Game, 0)
	for g := range toSave {
		if g.Steam != nil && g.Steam.SteamRefID != 0 {
			games = append(games, g)
		}
	}

	createStems(db, games)

	tx := db.Begin()
	for i, _ := range games {
		bazarId := *(games[i]).BazarekID
		steamId := games[i].Steam.SteamRefID
		tx2 := tx.Table("games as g").Where("g.bazarek_id = ?", bazarId)
		if games[i].Name != "" {
			tx2.Update("name", games[i].Name)
		}
		tx2.Update("steam_id", db.Table("steams").Select("id").Where("steam_ref_id = ?", steamId))
	}
	tx.Commit()
	e := time.Since(t)
	logrus.Infof("Saving Game steamsId's End! %s", e)
}
