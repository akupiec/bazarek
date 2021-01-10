package services

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"errors"
)

func CustomSave(id string, userId uint64, typeStr string) error {
	if typeStr != "" && model.CheckGameType(typeStr) == false {
		return errors.New("Invalid type!")
	}

	db := repository.DB
	var game model.Game
	db.Model(model.Game{}).Where("id = ?", id).First(&game)
	if game.ID == 0 {
		return errors.New("Invalid game id!")
	}

	tx := db.Begin()
	tx.Exec("DELETE FROM custom_games WHERE game_id = ? AND user_id = ?", id, userId)
	tx.Exec("INSERT OR IGNORE INTO custom_games (game_id, type, user_id) VALUES (?, ?, ?);", id, typeStr, userId)
	tx.Commit()
	return nil
}
