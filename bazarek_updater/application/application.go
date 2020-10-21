package application

import (
	"arkupiec/bazarek_updater/application/update"
	"arkupiec/bazarek_updater/repository"
)

func Run() {
	db := repository.DB
	update.SetDb(db)
	update.Update()
}
