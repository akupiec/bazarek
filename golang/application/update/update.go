package update

import "gorm.io/gorm"

var db *gorm.DB

func SetDb(_db *gorm.DB) {
	db = _db
}
