package application

import (
	"arkupiec/bazarek_searcher/repository"
	"encoding/json"
	"net/http"
	"net/url"
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

	p := repository.SearchParams{
		Price:        price,
		Search:       search,
		Limit:        limit,
		AllData:      allData,
		ReviewsCount: reviewsCount,
		Reviews:      reviews,
		Tags:         tags,
		Categories:   categories,
	}
	s := repository.SearchGames(&p)
	json.NewEncoder(w).Encode(&s)
}
