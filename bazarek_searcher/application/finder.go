package application

import (
	"arkupiec/bazarek_searcher/model"
	"encoding/json"
	"net/http"
	"net/url"
	"strconv"
)

func finder(w http.ResponseWriter, r *http.Request) {
	q, _ := url.ParseQuery(r.URL.RawQuery)
	price := r.URL.Query().Get("price")
	allData := r.URL.Query().Get("allData")
	limit := r.URL.Query().Get("limit")
	tags := q["tag"]
	categories := q["category"]
	reviews := q["review"]

	tx := db.Table("Steams AS s")
	if price != "" {
		tx.Joins("Bazarek")
		tx.Where("Bazarek__price < ?", price)
	}
	if len(tags) > 0 {
		tx.Where("s.id IN (?)", db.Table("tags as t").
			Select("st.steam_id").
			Joins("LEFT JOIN steam_tag st ON t.id == st.tag_id").
			Where("t.name IN ?", tags))
	}
	if len(categories) > 0 {
		tx.Where("s.id IN (?)", db.Table("categories as c").
			Select("st.steam_id").
			Joins("LEFT JOIN steam_category st ON c.id == st.category_id").
			Where("c.name IN ?", categories))
	}
	if len(reviews) > 0 {
		tx.Where("s.id IN (?)", db.Table("reviews as r").
			Select("st.steam_id").
			Joins("LEFT JOIN steam_review st ON r.id == st.review_id").
			Where("r.name IN ?", reviews))
	}
	if allData == "true" {
		tx.Preload("Tags")
	}

	if i, _ := strconv.Atoi(limit); i < 300 && i > 0 {
		tx.Limit(i)
	} else {
		tx.Limit(10)
	}

	var s []model.Steam
	tx.Find(&s)
	json.NewEncoder(w).Encode(s)
}
