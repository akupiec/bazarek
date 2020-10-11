package update

import (
	"arkupiec/bazarek/model"
)

func BazarekCleanupOld() {
	db.Where("steam_id IS NULL").Delete(model.Bazarek{})
}
