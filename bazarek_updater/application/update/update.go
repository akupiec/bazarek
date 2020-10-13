package update

import (
	"arkupiec/bazarek/model"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"time"
)

var db *gorm.DB

const POOL_SIZE int = 20
const UPDATE_TRESSHOLD_HOURS = 12
const STEAM_UPDATE_TRESSHOLD_DAYS = 4

func SetDb(_db *gorm.DB) {
	db = _db
}

func Update() {
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
}
