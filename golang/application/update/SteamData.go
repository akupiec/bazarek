package update

import (
	"arkupiec/bazarek/application/utils"
	"arkupiec/bazarek/model"
	"arkupiec/bazarek/repository"
	"github.com/PuerkitoBio/goquery"
	"github.com/sirupsen/logrus"
	"strings"
	"sync"
	"time"
)

func SteamData() {
	steams := needSteamUpdate()
	p := make(chan struct{}, POOL_SIZE)
	s := make(chan model.Steam)
	var wg sync.WaitGroup

	utils.StartProgress(len(steams))

	for _, ba := range steams {
		wg.Add(1)
		go func(game model.Steam) {
			p <- struct{}{}
			fetchFullGameData(&game)
			game.Updated = time.Now()
			<-p
			s <- game
			utils.ShowProgress(100)
			wg.Done()
		}(ba)
	}

	for game := range s {
		repository.SaveSteamGame(db, &game)
	}

	wg.Wait()
}

func needSteamUpdate() []model.Steam {
	var results []model.Steam
	u := time.Now().Add(time.Hour * 24 * STEAM_UPDATE_TRESSHOLD_DAYS * -1)
	db.Model(model.Steam{}).Where("name IS NULL OR updated < ?", u).Find(&results)
	return results
}

func fetchFullGameData(game *model.Steam) *model.Steam {
	err, doc := utils.Fetch(game.Href)
	if err != nil {
		logrus.Error(err)
		return game
	}
	if game.SteamType == model.SteamGame {
		return parseSteamGame(doc, game)
	}
	if game.SteamType == model.SteamBundle {
		return game
	}
	return game
}

func parseSteamGame(doc *goquery.Document, game *model.Steam) *model.Steam {
	n := doc.Find(".apphub_AppName").Text()
	game.Name = &n
	game.Tags = parseSteamTags(doc)
	game.Category = parseSteamCategory(doc)
	game.Price = parseSteamPrice(doc)
	r, r2 := parseReviews(doc)
	game.Review = r[:]
	game.ReviewsCount = &r2[0]
	game.LastReviewsCount = &r2[1]
	return game
}

func parseSteamPrice(doc *goquery.Document) *float32 {
	f := utils.FindFloat32(doc.Find(".game_purchase_price.price").Text())
	return &f
}

func parseReviews(doc *goquery.Document) ([2]model.Review, [2]uint16) {
	var r [2]model.Review
	var r2 [2]uint16
	doc.Find(".user_reviews_summary_row .game_review_summary").Each(func(i int, s *goquery.Selection) {
		r[i] = model.Review{Name: s.Text()}
	})
	doc.Find(".user_reviews_summary_row .responsive_hidden").Each(func(i int, s *goquery.Selection) {
		text := s.Text()
		a := utils.FindIntSeparated(text)
		r2[i] = uint16(a)
	})
	return r, r2
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
