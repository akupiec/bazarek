package application

import (
	"arkupiec/bazarek_searcher/repository"
	"github.com/gin-gonic/gin"
	"net/url"
	"strconv"
)

func finder(c *gin.Context) {
	q, _ := url.ParseQuery(c.Request.URL.RawQuery)
	price := c.Query("price")
	reviewsAnd, _ := strconv.ParseBool(c.Query("reviewsAnd"))
	tagsAnd, _ := strconv.ParseBool(c.Query("tagsAnd"))
	categoriesAnd, _ := strconv.ParseBool(c.Query("categoriesAnd"))
	limit, _ := strconv.Atoi(c.Query("limit"))
	reviewsCount := c.Query("reviewsCount")
	search := c.Query("search")
	tags := q["tag"]
	categories := q["category"]
	gameType := q["gameType"]
	reviews := q["review"]

	p := repository.SearchParams{
		Price:         price,
		Search:        search,
		Limit:         limit,
		ReviewsCount:  reviewsCount,
		Reviews:       reviews,
		ReviewsAnd:    reviewsAnd,
		Tags:          tags,
		TagsAnd:       tagsAnd,
		Categories:    categories,
		CategoriesAnd: categoriesAnd,
		GameType:      gameType,
	}
	s := repository.SearchGames(&p)
	c.JSON(200, s)
}
