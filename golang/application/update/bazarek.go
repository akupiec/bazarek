package update

import (
	"arkupiec/bazarek/model"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"time"
)

func Bazarek(db *gorm.DB) {
	if isNothingToUpdate(db) {
		logrus.Info("Nothing to update, in Bazarek")
		return
	}
	BazarekCleanupOld(db)
	logrus.Info("Downloading new pages!")
	BazarekGeneralData(db)
	logrus.Info("Downloading missing steamIds")
	BazarekSteamId(db)
}

func isNothingToUpdate(db *gorm.DB) bool {
	u := time.Now().Local().Add(time.Hour * -12)
	var result model.Bazarek
	db.Model(model.Bazarek{}).Where("updated < ?", u).Find(&result)

	return result.ID == 0
}
