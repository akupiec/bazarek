package repository

import (
	"arkupiec/bazarek_searcher/model"
	"gorm.io/gorm"
	"strings"
)

type SearchParams struct {
	Price         string
	Search        string
	Limit         int
	AllData       bool
	ReviewsCount  string
	Reviews       []string
	ReviewsAnd    bool
	Tags          []string
	TagsAnd       bool
	Categories    []string
	CategoriesAnd bool
}

func SearchGames(p *SearchParams) []model.Steam {
	db := DB
	tx := db.Table("Steams AS s")
	gameFilterPrice(p.Price, tx)
	gameFilterName(p.Search, tx)
	gameFilterTags(p.Tags, p.TagsAnd, tx)
	gameFilterCategory(p.Categories, p.CategoriesAnd, tx)
	gameFilterReview(p.Reviews, p.ReviewsAnd, tx)
	gameFilterReviewCount(p.ReviewsCount, tx)
	includeChildData(p.AllData, tx)
	gameLimit(p.Limit, tx)
	var s []model.Steam
	tx.Find(&s)
	return s
}

func gameLimit(i int, tx *gorm.DB) {
	if i < 300 && i > 0 {
		tx.Limit(i)
	} else {
		tx.Limit(10)
	}
}

func includeChildData(allData bool, tx *gorm.DB) {
	if allData == true {
		tx.Preload("Review")
		tx.Preload("Tags")
		tx.Preload("Category")
	}
}

func gameFilterReviewCount(reviewsCount string, tx *gorm.DB) {
	if reviewsCount != "" {
		tx.Where("s.reviews_count >= (?)", reviewsCount)
	}
}

func gameFilterPrice(price string, tx *gorm.DB) {
	tx.Joins("Bazarek")
	if price != "" {
		tx.Where("Bazarek__price < ? OR (s.price IS NOT NULL AND s.price < ? AND s.price != 0)", price, price)
	}
}

func gameFilterReview(reviews []string, _ bool, tx *gorm.DB) {
	if len(reviews) > 0 {
		tx.Where("s.id IN (?)", DB.Table("steam_review as sr").
			Select("sr.steam_id").
			Where("sr.review_id IN ?", reviews))
	}
}

func gameFilterCategory(categories []string, _ bool, tx *gorm.DB) {
	if len(categories) > 0 {
		tx.Where("s.id IN (?)", DB.Table("steam_category as sc").
			Select("sc.steam_id").
			Where("sc.category_id IN ?", categories))
	}
}

func gameFilterTags(tags []string, _ bool, tx *gorm.DB) {
	if len(tags) > 0 {
		tx.Where("s.id IN (?)", DB.Table("steam_tag as st").
			Select("st.steam_id").
			Where("st.tag_id IN ?", tags))
	}
}

func gameFilterName(search string, tx *gorm.DB) {
	if search != "" {
		search = strings.ReplaceAll(search, "*", "%")
		subSearch := strings.Split(search, " ")
		for _, s := range subSearch {
			s = "%" + s + "%"
			tx.Where("s.name LIKE (?)", s)
		}
	}
}
