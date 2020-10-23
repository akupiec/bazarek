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

func SearchGames(p *SearchParams) []model.Game {
	db := DB
	tx := db.Table("Games AS g")
	tx.Joins("Bazarek")
	tx.Joins("Steam")

	gameFilterPrice(p.Price, tx)
	gameFilterName(p.Search, tx)
	gameFilterTags(p.Tags, p.TagsAnd, tx)
	gameFilterCategory(p.Categories, p.CategoriesAnd, tx)
	gameFilterReview(p.Reviews, p.ReviewsAnd, tx)
	gameFilterReviewCount(p.ReviewsCount, tx)
	includeChildData(p.AllData, tx)
	gameLimit(p.Limit, tx)
	var s []model.Game
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
		tx.Where("g.reviews_count >= (?)", reviewsCount)
	}
}

func gameFilterPrice(price string, tx *gorm.DB) {
	if price != "" {
		tx.Where("Bazarek__price < ? OR (Steam__price IS NOT NULL AND Steam__price < ? AND Steam__price != 0)", price, price)
	}
}

func gameFilterReview(reviews []string, _ bool, tx *gorm.DB) {
	if len(reviews) > 0 {
		tx.Where("g.review_id IN (?)", reviews)
	}
}

func gameFilterCategory(categories []string, _ bool, tx *gorm.DB) {
	if len(categories) > 0 {
		tx.Where("g.id IN (?)", DB.Table("steam_category as sc").
			Select("sc.game_id").
			Where("sc.category_id IN ?", categories))
	}
}

func gameFilterTags(tags []string, _ bool, tx *gorm.DB) {
	if len(tags) > 0 {
		tx.Where("g.id IN (?)", DB.Table("steam_tag as st").
			Select("st.game_id").
			Where("st.tag_id IN ?", tags))
	}
}

func gameFilterName(search string, tx *gorm.DB) {
	if search != "" {
		search = strings.ReplaceAll(search, "*", "%")
		subSearch := strings.Split(search, " ")
		for _, s := range subSearch {
			s = "%" + s + "%"
			tx.Where("g.name LIKE (?)", s)
		}
	}
}
