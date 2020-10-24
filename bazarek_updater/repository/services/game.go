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
	db := repository.DB
	games := make([]model.Game, 0)
	for g := range toSave {
		games = append(games, g)
	}

	tx := db.Begin()
	for i, _ := range games {
		games[i].Steam.Updated = time.Now()
		tx.Model(model.Steam{}).Where("id = ?", games[i].Steam.ID).Select("price", "updated").Updates(&(games[i].Steam))

		if games[i].Review != nil && games[i].Review.Name != "" && *games[i].ReviewsCount > 10 {
			tx.Table("reviews").Where("name = ?", games[i].Review.Name).First(&(games[i].Review))
		} else {
			games[i].Review = nil
			games[i].ReviewID = nil
		}
		tx.Save(&(games[i]))
	}
	tx.Commit()
}

func SaveGameNameWithBazarek(toSave chan model.Game) {
	t := time.Now()
	logrus.Info("Saving Game bazareks Start!")
	db := repository.DB
	games := make([]model.Game, 0)
	for g := range toSave {
		g.Bazarek.Updated = time.Now()
		games = append(games, g)
	}

	tx := db.Begin()
	for i, _ := range games {
		ret := *(games[i]).Bazarek
		tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "bazarek_ref_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"price", "offers", "updated"}),
		}).Create(&ret)
	}
	tx.Commit()
	tx = db.Begin()
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
		g.Steam.Updated = time.Now()
		if g.Steam.SteamRefID != 0 {
			games = append(games, g)
		}
	}

	tx := db.Begin()
	for i, _ := range games {
		ret := *(games[i]).Steam
		tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "steam_ref_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"price", "updated"}),
		}).Create(&ret)
	}
	tx.Commit()

	tx = db.Begin()
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
