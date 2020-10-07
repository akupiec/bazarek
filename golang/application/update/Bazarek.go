package update

import (
	"github.com/PuerkitoBio/goquery"
	"gorm.io/gorm"
	"log"
	"net/http"
	"net/url"
	"strconv"
)

const MAX_BAZAREK_PAGES int = 120

var db *gorm.DB

func Bazarek(_db *gorm.DB) {
	db = _db
	fetchBazarekPage(1)
}

func BazarekBasicData() {
	for i := 0; i < MAX_BAZAREK_PAGES; i++ {

	}
}

func fetchBazarekPage(page int) {
	u, _ := url.Parse("https://bazar.lowcygier.pl/?type=&platform=&platform%5B%5D=1&platform%5B%5D=5&platform%5B%5D=7&payment=&payment%5B%5D=1&game_type=&game_type%5B%5D=game&game_type%5B%5D=dlc&game_type%5B%5D=pack&game_genre=&title=&game_id=&sort=title")
	q := u.Query()
	q.Add("per-page", "100")
	q.Add("page", strconv.Itoa(page))
	u.RawQuery = q.Encode()

	res, err := http.Get(u.String())
	if err != nil {
		log.Fatalln(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	n := doc.Find(".sidebar-reviews article .content-block").Nodes
	log.Printf("nodes %v", n)
}
