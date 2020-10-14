package update

import (
	"arkupiec/bazarek_updater/model"
	"time"
)

func BazarekCleanupOld() {
	db.Model(&model.Bazarek{}).Where("1 = 1").Updates(map[string]interface{}{"price": "0", "offers": 0, "updated": time.Now()})
}

func BazarekCleanUpIncomplete() {
	db.Where("steam_id IS NULL").Delete(&model.Bazarek{})
}
