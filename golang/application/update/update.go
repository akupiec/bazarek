package update

import (
	"gorm.io/gorm"
)

var db *gorm.DB

const POOL_SIZE int = 20
const UPDATE_TRESSHOLD_HOURS = 12

func SetDb(_db *gorm.DB) {
	db = _db
}
