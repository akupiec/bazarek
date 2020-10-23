package update

import (
	"arkupiec/bazarek_updater/application/utils"
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository/services"
	"github.com/PuerkitoBio/goquery"
	"github.com/sirupsen/logrus"
	"strings"
	"sync"
)

func SteamData(games []model.Game) {
	p := make(chan struct{}, POOL_SIZE)
	var wg sync.WaitGroup

	utils.StartProgress(len(games))
	for _, g := range games {
		wg.Add(1)
		go func(game model.Game) {
			p <- struct{}{}
			fetchFullGameData(&game)
			<-p
			services.SaveGame(&game)
			utils.ShowProgress(100)
			wg.Done()
		}(g)
	}
	wg.Wait()
}

func fetchFullGameData(game *model.Game) *model.Game {
	err, doc := utils.GetWithCookie(game.Steam.Href, "wants_mature_content=1; birthtime=312850801;")
	if err != nil {
		logrus.Error(err)
		game.Steam = nil
		*game.ReviewsCount = 0
		return game
	}
	if game.Steam.SteamType == model.SteamGame {
		return parseSteamGame(doc, game)
	}
	if game.Steam.SteamType == model.SteamBundle {
		return parseSteamBundle(doc, game)
	}
	return parseSteamBundle(doc, game)
}

func parseSteamBundle(doc *goquery.Document, game *model.Game) *model.Game {
	n := doc.Find(".page_title_area .pageheader").Text()
	if n != "" {
		game.Name = n
	}
	var i uint16 = 0
	game.ReviewsCount = &i
	return game
}

func parseSteamGame(doc *goquery.Document, game *model.Game) *model.Game {
	title := doc.Find("title").Text()
	if title == "Welcome to Steam" {
		game.Steam = nil
		u := uint16(0)
		game.ReviewsCount = &u
		return game
	}
	n := doc.Find(".apphub_AppName").Text()
	game.Name = n
	game.Tags = parseSteamTags(doc)
	game.Category = parseSteamCategory(doc)
	game.Steam.Price = parseSteamPrice(doc)
	review, revCount := parseReviews(doc)
	game.Review = &review
	game.ReviewsCount = &revCount
	return game
}

func parseSteamPrice(doc *goquery.Document) *float32 {
	f := utils.FindFloat32(doc.Find(".game_purchase_price.price").Text())
	return &f
}

func parseReviews(doc *goquery.Document) (model.Review, uint16) {
	var r []model.Review
	var r2 []uint16
	doc.Find(".user_reviews_summary_row .game_review_summary").Each(func(i int, s *goquery.Selection) {
		text := s.Text()
		r = append(r, model.Review{Name: text})
	})
	doc.Find(".user_reviews_summary_row .responsive_hidden").Each(func(i int, s *goquery.Selection) {
		text := s.Text()
		a := utils.FindIntSeparated(text)
		r2 = append(r2, uint16(a))
	})
	var review model.Review
	var count uint16
	if len(r2) > 1 { // multi review over 10
		review = r[1]
		count = r2[1]
	} else if len(r2) > 0 { // some reviews over 10
		review = r[0]
		count = r2[0]
	} else if len(r) == 1 && len(r2) == 0 { // reviews less then 10
		c := utils.FindInt(r[0].Name)
		count = uint16(c)
	} else if len(r) == 0 && len(r2) == 0 { //no user reviews
		count = 0
	}

	return review, count
}

func parseSteamCategory(doc *goquery.Document) []model.Category {
	var c []model.Category
	doc.Find("#category_block  .name").Each(func(i int, s *goquery.Selection) {
		cs := model.Category{Name: s.Text()}
		c = append(c, cs)
	}).Text()
	return c
}

func parseSteamTags(doc *goquery.Document) []model.Tag {
	t := doc.Find(".popular_tags_ctn > div.glance_tags").Text()
	t = strings.ReplaceAll(t, "\t", "")
	t = strings.TrimSuffix(t, "\n")
	t = strings.TrimSuffix(t, "+")
	tagsStr := strings.Split(t, "\n")
	var tags []model.Tag
	for _, tt := range tagsStr {
		if tt != "" {
			tags = append(tags, model.Tag{Name: tt})
		}
	}
	return tags
}
