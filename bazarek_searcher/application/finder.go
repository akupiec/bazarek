package application

import (
	"arkupiec/bazarek_searcher/model"
	"encoding/json"
	"net/http"
	"net/url"
	"strconv"
)

func finder(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	q, _ := url.ParseQuery(r.URL.RawQuery)
	price := r.URL.Query().Get("price")
	allData := r.URL.Query().Get("allData")
	limit := r.URL.Query().Get("limit")
	reviewsCount := r.URL.Query().Get("reviewsCount")
	search := r.URL.Query().Get("search")
	tags := q["tag"]
	categories := q["category"]
	reviews := q["review"]

	tx := db.Table("Steams AS s")
	tx.Joins("Bazarek")
	if price != "" {
		tx.Where("Bazarek__price < ? OR (s.price IS NOT NULL AND s.price < ? AND s.price != 0)", price, price)
	}
	if search != "" {
		tx.Where("Bazarek__name IS (?) OR s.name IS (?)", search, search)
	}
	if len(tags) > 0 {
		tx.Where("s.id IN (?)", db.Table("steam_tag as st").
			Select("st.steam_id").
			Where("st.tag_id IN ?", tags))
	}
	if len(categories) > 0 {
		tx.Where("s.id IN (?)", db.Table("steam_category as sc").
			Select("sc.steam_id").
			Where("sc.category_id IN ?", categories))
	}
	if len(reviews) > 0 {
		tx.Where("s.id IN (?)", db.Table("steam_review as sr").
			Select("sr.steam_id").
			Where("sr.review_id IN ?", reviews))
	}
	if reviewsCount != "" {
		tx.Where("s.reviews_count >= (?)", reviewsCount)
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
	tx.Preload("Review")
	tx.Preload("Tags")
	tx.Preload("Category")
	tx.Find(&s)
	json.NewEncoder(w).Encode(&s)
}
