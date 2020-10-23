package update

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository/services"
	"github.com/sirupsen/logrus"
	"time"
)

const MAX_BAZAREK_PAGES int = 50
const POOL_SIZE int = 20
const UPDATE_TRESSHOLD_HOURS = 12
const STEAM_UPDATE_TRESSHOLD_DAYS = 4

func Update() {
	if needBazarekUpdate() {
		services.BazarekCleanupOld()
		logrus.Info("Downloading new pages!")
		BazarekGeneralData()
		logrus.Info("Downloading missing steamIds")
		BazarekSteamId()
		services.BazarekCleanUpIncomplete()
	}
	logrus.Info("Bazarek done!")
	SteamData(getOldGamesSteams())
	logrus.Info("Steam done!")
}

func needBazarekUpdate() bool {
	u := time.Now().Add(time.Hour * UPDATE_TRESSHOLD_HOURS * -1)
	return services.HaveOldBazareks(u)
}

func getOldGamesSteams() []model.Game {
	u := time.Now().Add(time.Hour * 24 * STEAM_UPDATE_TRESSHOLD_DAYS * -1)
	return services.GetOldSteamsEager(u)
}
