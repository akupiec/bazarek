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
	ReviewsCount  string
	Reviews       []string
	ReviewsAnd    bool
	Tags          []string
	TagsAnd       bool
	Categories    []string
	CategoriesAnd bool
	GameType      []string
	GameTypeAnd   bool
}

func SearchGames(p *SearchParams) []model.Game {
	db := DB
	tx := db.Table("Games AS g")
	tx.Joins("Bazarek")
	tx.Joins("Steam")
	tx.Joins("Review")

	gameFilterPrice(p.Price, tx)
	gameFilterName(p.Search, tx)
	gameFilterTags(p.Tags, p.TagsAnd, tx)
	gameFilterCategory(p.Categories, p.CategoriesAnd, tx)
	gameFilterReview(p.Reviews, p.ReviewsAnd, tx)
	gameFilterReviewCount(p.ReviewsCount, tx)
	gameLimit(p.Limit, tx)
	tx.Order("g.price asc")
	tx.Order("g.review_id desc")
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

func gameFilterReviewCount(reviewsCount string, tx *gorm.DB) {
	if reviewsCount != "" {
		tx.Where("g.reviews_count >= (?)", reviewsCount)
	}
}

func gameFilterPrice(price string, tx *gorm.DB) {
	if price != "" {
		tx.Where("g.price < ?", price)
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
	} else if len(categories) > 0 {
		raw := "SELECT game_id FROM steam_category WHERE category_id = ?"
		s := make([]interface{}, len(categories))
		s[0] = categories[0]
		for i := 1; i < len(categories); i++ {
			raw += " INTERSECT"
			raw += " SELECT game_id FROM steam_category WHERE category_id = ?"
			s[i] = categories[i]
		}
		var ids []uint
		DB.Raw(raw, s...).Scan(&ids)
		tx.Where("g.id IN (?)", ids)
	}
}

func gameFilterTags(tags []string, and bool, tx *gorm.DB) {
	if len(tags) > 0 && and == false {
		tx.Where("g.id IN (?)", DB.Table("steam_tag as st").
			Select("st.game_id").
			Where("st.tag_id IN ?", tags))
	} else if len(tags) > 0 {
		raw := "SELECT game_id FROM steam_tag WHERE tag_id = ?"
		s := make([]interface{}, len(tags))
		s[0] = tags[0]
		for i := 1; i < len(tags); i++ {
			raw += " INTERSECT"
			raw += " SELECT game_id FROM steam_tag WHERE tag_id = ?"
			s[i] = tags[i]
		}
		var ids []uint
		DB.Raw(raw, s...).Scan(&ids)
		tx.Where("g.id IN (?)", ids)
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
