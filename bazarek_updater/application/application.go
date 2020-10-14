package application

import (
	"arkupiec/bazarek_updater/application/update"
	"gorm.io/gorm"
)

func Run(db *gorm.DB) {
	update.SetDb(db)
	update.Update()
}
