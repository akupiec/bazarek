package update

import "arkupiec/bazarek_updater/repository"

func PriceDataUpdate() {
	repository.DB.Exec("UPDATE games SET price = NULL where 1=1;" +
		"UPDATE games SET price = (SELECT price FROM bazareks WHERE games.bazarek_id == bazareks.id) WHERE steam_id IS NULL AND price IS NULL;" +
		"UPDATE games SET price = (SELECT price FROM steams WHERE games.steam_id == steams.id) WHERE bazarek_id IS NULL AND price IS NULL;" +
		"UPDATE games SET price = (" +
		"    SELECT CASE" +
		"        WHEN s.price >= b.price AND s.price IS NOT NULL AND b.price != 0 THEN b.price" +
		"        WHEN s.price IS NULL THEN b.price" +
		"        ELSE s.price" +
		"        END AS price" +
		"        FROM games as g" +
		"            JOIN bazareks b on b.id = g.bazarek_id" +
		"             JOIN steams s on s.id = g.steam_id" +
		"             WHERE games.id == g.id) WHERE games.price IS NULL;")
}
