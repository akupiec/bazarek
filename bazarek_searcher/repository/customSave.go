package repository

import (
	"arkupiec/bazarek_searcher/model"
	"errors"
)

func CustomSave(id string, userId uint64, typeStr string) error {
	if typeStr != "" && model.CheckGameType(typeStr) == false {
		return errors.New("Invalid type!")
	}

	var game model.Game
	DB.Model(model.Game{}).Where("id = ?", id).First(&game)
	if game.ID == 0 {
		return errors.New("Invalid game id!")
	}

	tx := DB.Begin()
	tx.Exec("DELETE FROM custom_games WHERE game_id = ? AND user_id = ?", id, userId)
	tx.Exec("INSERT OR IGNORE INTO custom_games (game_id, type, user_id) VALUES (?, ?, ?);", id, typeStr, userId)
	tx.Commit()
	return nil
}
