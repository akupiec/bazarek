package update

import (
	"arkupiec/bazarek/model"
	"github.com/sirupsen/logrus"
	"time"
)

func Bazarek() {
	if needBazarekUpdate() {
		BazarekCleanupOld()
		logrus.Info("Downloading new pages!")
		BazarekGeneralData()
		logrus.Info("Downloading missing steamIds")
		BazarekSteamId()
		BazarekCleanUpIncomplete()
	}
	logrus.Info("Bazarek done!")
	SteamData()
	logrus.Info("Steam done!")
}

func needBazarekUpdate() bool {
	var ba model.Bazarek
	u := time.Now().Add(time.Hour * UPDATE_TRESSHOLD_HOURS * -1)
	db.Where("updated < ?", u).First(&ba)
	return ba.ID != 0
	//return true
}
