package update

import (
	"arkupiec/bazarek/model"
	"github.com/sirupsen/logrus"
	"time"
)

func Bazarek() {
	if isNothingToUpdate() {
		logrus.Info("Nothing to update, in Bazarek")
		return
	}
	BazarekCleanupOld()
	logrus.Info("Downloading new pages!")
	BazarekGeneralData()
	logrus.Info("Downloading missing steamIds")
	BazarekSteamId()
}

func isNothingToUpdate() bool {
	u := time.Now().Local().Add(time.Hour * -12)
	var result model.Bazarek
	db.Model(model.Bazarek{}).Where("updated < ?", u).Find(&result)

	return result.ID == 0
}
