package update

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository/services"
	"github.com/sirupsen/logrus"
	"time"
)

const MAX_BAZAREK_PAGES int = 120
const FETCH_POOL_SIZE int = 20
const SAVE_POOL_SIZE int = 100
const UPDATE_TRESSHOLD_HOURS = 12
const STEAM_UPDATE_TRESSHOLD_DAYS = 4

func Update() {
	UpdateBazarek()
	UpdateSteam()

	PriceDataUpdate()
	logrus.Info("Price check done!")
}

func UpdateSteam() {
	toUpdate := getOldGamesSteams()
	if len(toUpdate) > 0 {
		logrus.Info("Downloading steam data!")
		SteamData(toUpdate)
	}
	logrus.Info("Steam done!")
}

func UpdateBazarek() {
	if needBazarekUpdate() {
		services.BazarekCleanupOld()
		logrus.Info("Bazarek: Downloading new pages!")
		BazarekGeneralData()
		logrus.Info("Bazarek: Downloading steamIds")
		BazarekSteamId()
	}
	logrus.Info("Bazarek done!")
}

func needBazarekUpdate() bool {
	u := time.Now().Add(time.Hour * UPDATE_TRESSHOLD_HOURS * -1)
	return services.HaveOldBazareks(u)
}

func getOldGamesSteams() []model.Game {
	u := time.Now().Add(time.Hour * 24 * STEAM_UPDATE_TRESSHOLD_DAYS * -1)
	return services.GetOldSteamsEager(u)
}
