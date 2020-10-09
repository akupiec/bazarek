package update

import (
	"arkupiec/bazarek/model"
	"gorm.io/gorm"
	"time"
)

func BazarekCleanupOld(db *gorm.DB) {
	u := time.Now().Local().Add(time.Hour * -6)
	db.Where("steam_id IS NULL AND updated < ?", u).Delete(model.Bazarek{})
}
