package update

import (
	"arkupiec/bazarek/application/utils"
	"arkupiec/bazarek/model"
	"github.com/PuerkitoBio/goquery"
	log "github.com/sirupsen/logrus"
	"gorm.io/gorm/clause"
	"net/url"
	"strconv"
	"time"
)

const MAX_BAZAREK_PAGES int = 120
const PAGE_SIZE int = 100

func BazarekGeneralData() {
	channel := make(chan [PAGE_SIZE]model.Bazarek, MAX_BAZAREK_PAGES)

	utils.StartProgress(MAX_BAZAREK_PAGES)
	for i := 1; i < MAX_BAZAREK_PAGES+1; i++ {
		go func(pageNr int) {
			d := fetchPage(pageNr)
			channel <- parsePage(d)
			utils.ShowProgress(10)
		}(i)

		games := getGamesOnPage(channel)
		updateGamesInDb(games)
	}
}

func updateGamesInDb(games []model.Bazarek) {
	db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "bazarek_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"price", "offers", "updated"}),
	}).Create(&games)
}

func getGamesOnPage(channel chan [PAGE_SIZE]model.Bazarek) []model.Bazarek {
	var games []model.Bazarek
	pageGames := <-channel
	for _, game := range pageGames {
		if game.Href != "" {
			games = append(games, game)
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

func parsePage(doc *goquery.Document) [PAGE_SIZE]model.Bazarek {
	var games [PAGE_SIZE]model.Bazarek

	doc.Find("div.list-view > div").Each(func(i int, s *goquery.Selection) {
		var game model.Bazarek
		tS := s.Find(".media-heading a")
		title := tS.Text()
		href, _ := tS.Attr("href")
		id := utils.FindUInt32(href)
		prc := utils.FindFloat32(s.Find(".mobile .prc").Text())
		offers := utils.FindUInt8(s.Find(".mobile .prc-text").Text())

		game.Name = title
		game.BazarekID = id
		game.Href = href
		game.Price = prc
		game.Offers = offers
		game.Updated = time.Now()
		game.SteamID = nil
		games[i] = game
	})
	return games
}
