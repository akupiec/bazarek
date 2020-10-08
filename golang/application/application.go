package application

import (
	"arkupiec/bazarek/application/update"
	"gorm.io/gorm"
)

func Run(db *gorm.DB) {
	//update.BazarekGeneralData(db)
	update.BazarekSteamId(db)
}
