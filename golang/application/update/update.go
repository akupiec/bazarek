package update

import (
	"gorm.io/gorm"
)

var db *gorm.DB

const POOL_SIZE int = 20
const UPDATE_TRESSHOLD_HOURS = 12
const STEAM_UPDATE_TRESSHOLD_DAYS = 4

func SetDb(_db *gorm.DB) {
	db = _db
}
