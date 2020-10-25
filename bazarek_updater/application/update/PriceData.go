package update

import "arkupiec/bazarek_updater/repository"

func PriceDataUpdate() {
	repository.DB.Exec("UPDATE games SET price = NULL where 1=1;\nUPDATE games SET price = (SELECT price FROM bazareks WHERE games.bazarek_id == bazareks.id) WHERE steam_id IS NULL AND price IS NULL;\nUPDATE games SET price = (SELECT price FROM steams WHERE games.steam_id == steams.id) WHERE steam_id IS NULL AND price IS NULL;\nUPDATE games SET price = (\n    SELECT CASE\n    WHEN s.price >= b.price THEN s.price\n    ELSE b.price\n    END AS price\n        FROM games as g\n            JOIN bazareks b on b.id = g.bazarek_id\n             JOIN steams s on s.id = g.steam_id\n             WHERE games.id == g.id) WHERE games.price IS NULL;\n")
}
