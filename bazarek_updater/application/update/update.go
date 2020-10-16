package update

import (
	"arkupiec/bazarek_updater/model"
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
	steams := needSteamUpdate()
	SteamData(steams)
	logrus.Info("Steam done!")
}

func needBazarekUpdate() bool {
	u := time.Now().Add(time.Hour * UPDATE_TRESSHOLD_HOURS * -1)
	var needUpdate int64
	var total int64
	db.Model(&model.Bazarek{}).Where("updated < ?", u).Count(&needUpdate)
	db.Model(&model.Bazarek{}).Where("1=1").Count(&total)
	return needUpdate > 0 || total == 0
}

func needSteamUpdate() []model.Steam {
	var results []model.Steam
	tx := db.Model(model.Steam{})
	u := time.Now().Add(time.Hour * 24 * STEAM_UPDATE_TRESSHOLD_DAYS * -1)
	tx.Where("name IS NULL OR updated < ?", u)
	//tx.Where("id IN (?)", db.Table("steam_review as sr").
	//	Select("sr.steam_id").
	//	Where("sr.review_id = 1"))
	//tx.Where("1=1")
	tx.Find(&results)
	return results
}
