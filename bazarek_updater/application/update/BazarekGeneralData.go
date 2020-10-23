package update

import (
	"arkupiec/bazarek_updater/application/utils"
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository/services"
	"github.com/PuerkitoBio/goquery"
	log "github.com/sirupsen/logrus"
	"net/url"
	"strconv"
	"sync"
	"time"
)

const PAGE_SIZE int = 100

func BazarekGeneralData() {
	p := make(chan struct{}, POOL_SIZE)
	var wg sync.WaitGroup

	utils.StartProgress(MAX_BAZAREK_PAGES)
	for i := 1; i < MAX_BAZAREK_PAGES+1; i++ {
		wg.Add(1)
		go func(pageNr int) {
			p <- struct{}{}
			d := fetchPage(pageNr)
			<-p
			games := parsePage(d)
			services.SaveBulkGamesWithBazareks(games)
			utils.ShowProgress(10)
			wg.Done()
		}(i)
	}
	wg.Wait()
}

func filterEmpty(pageGames [PAGE_SIZE]model.Game) []model.Game {
	var games []model.Game
	for _, g := range pageGames {
		if g.Bazarek != nil {
			games = append(games, g)
		}
	}

	return games
}

func fetchPage(page int) *goquery.Document {
	u, _ := url.Parse("https://bazar.lowcygier.pl/?type=&platform=&platform%5B%5D=1&platform%5B%5D=5&platform%5B%5D=7&payment=&payment%5B%5D=1&game_type=&game_type%5B%5D=game&game_type%5B%5D=dlc&game_type%5B%5D=pack&game_genre=&title=&game_id=&sort=title")
	log.Debugf("fetch success of page: %d!", page)
	q := u.Query()
	q.Add("per-page", "100")
	q.Add("page", strconv.Itoa(page))
	u.RawQuery = q.Encode()

	err, doc := utils.Fetch(u.String())
	if err != nil {
		log.Fatal(err)
	}
	return doc
}

func parsePage(doc *goquery.Document) []model.Game {
	var games [PAGE_SIZE]model.Game

	doc.Find("div.list-view > div").Each(func(i int, s *goquery.Selection) {
		var bazarek model.Bazarek
		var game model.Game
		tS := s.Find(".media-heading a")
		name := tS.Text()
		href, _ := tS.Attr("href")
		id := utils.FindUInt32(href)
		prc := utils.FindFloat32(s.Find(".mobile .prc").Text())
		offers := utils.FindUInt8(s.Find(".mobile .prc-text").Text())

		bazarek.BazarekRefID = id
		bazarek.Href = href
		bazarek.Price = prc
		bazarek.Offers = offers
		bazarek.Updated = time.Now()
		if game.Name == "" {
			game.Name = name
		}
		game.Bazarek = &bazarek
		games[i] = game
	})

	return filterEmpty(games)
}
