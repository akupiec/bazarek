package update

import (
	"arkupiec/bazarek_updater/application/utils"
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"github.com/PuerkitoBio/goquery"
	"github.com/sirupsen/logrus"
	"regexp"
	"strings"
	"sync"
	"time"
)

func SteamData(steams []model.Steam) {
	p := make(chan struct{}, POOL_SIZE)
	toSave := make(chan model.Steam, len(steams))
	var wg sync.WaitGroup

	utils.StartProgress(len(steams))

	for _, ba := range steams {
		wg.Add(1)
		go func(game model.Steam) {
			p <- struct{}{}
			fetchFullGameData(&game)
			game.Updated = time.Now()
			<-p
			toSave <- game
			utils.ShowProgress(100)
			wg.Done()
		}(ba)
	}
	wg.Wait()
	saveAllGames(toSave)
}

func saveAllGames(toSave chan model.Steam) {
	close(toSave)
	for game := range toSave {
		repository.SaveSteamGame(db, &game)
	}
}

func fetchFullGameData(game *model.Steam) *model.Steam {
	err, doc := utils.GetWithCookie(game.Href, "wants_mature_content=1; birthtime=312850801;")
	if err != nil {
		logrus.Error(err)
		return game
	}
	if game.SteamType == model.SteamGame {
		return parseSteamGame(doc, game)
	}
	if game.SteamType == model.SteamBundle {
		return parseSteamBundle(doc, game)
	}
	return parseSteamBundle(doc, game)
}

func parseSteamBundle(doc *goquery.Document, game *model.Steam) *model.Steam {
	n := doc.Find(".page_title_area .pageheader").Text()
	game.Name = &n
	return game
}

func parseSteamGame(doc *goquery.Document, game *model.Steam) *model.Steam {
	title := doc.Find("title").Text()
	if title == "Welcome to Steam" {
		n := "NOT IN STEAM"
		game.Name = &n
		return game
	}
	n := doc.Find(".apphub_AppName").Text()
	game.Name = &n
	game.Tags = parseSteamTags(doc)
	game.Category = parseSteamCategory(doc)
	game.Price = parseSteamPrice(doc)
	r, r2 := parseReviews(doc)
	game.Review = filterEmptyReviews(r)
	if len(game.Review) == 2 {
		game.LastReviewsCount = &r2[0]
		game.ReviewsCount = &r2[1]
	} else {
		game.ReviewsCount = &r2[0]
	}
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

func filterEmptyReviews(reviews [2]model.Review) []model.Review {
	var r []model.Review
	reg := regexp.MustCompile(`\d .+`)
	for _, re := range reviews {
		if re.Name != "" && !reg.MatchString(re.Name) {
			r = append(r, re)
		}
	}
	return r
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
