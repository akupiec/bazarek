package update

import (
	"arkupiec/bazarek/application/utils"
	"arkupiec/bazarek/model"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"sync"
	"time"
)

const POOL_SIZE int = 20

var total int = 0

func BazarekSteamId(db *gorm.DB) {
	var results []model.Bazarek
	updated := time.Now().Local().Add(time.Minute * -15)
	db.Model(model.Bazarek{}).Where("updated < ? AND steam_id IS NULL", updated).Find(&results)

	ch := make(chan int, POOL_SIZE)
	var wg sync.WaitGroup

	logrus.Warnf("to download: %d", len(results))
	for i := 0; i < len(results); i++ {
		wg.Add(1)
		go func(game model.Bazarek) {
			ch <- 1
			steamGame := fetchGameInfo(game.Href)
			if steamGame.Href != "" {
				db.Clauses(clause.OnConflict{DoNothing: true}).Create(&steamGame)
				if steamGame.ID == 0 {
					db.Where("steam_ref_id = ?", steamGame.SteamRefID).First(&steamGame)
				}
				if steamGame.ID == 0 {
					panic("what do you think you are doing!")
				}
				game.SteamID = &steamGame.ID
				db.Save(&game)
				logrus.Infof("game id: %d save done!", game.BazarekID)
			}
			<-ch
			total++
			if total%100 == 0 {
				logrus.Warnf("to download: %d", len(results)-total)
			}
			wg.Done()
		}(results[i])
	}
	wg.Wait()
	logrus.Info(results)
}

func fetchGameInfo(href string) model.Steam {
	err, doc := utils.Fetch("https://bazar.lowcygier.pl" + href)
	if err != nil {
		logrus.Error(err)
		return model.Steam{}
	}
	steamHref, _ := doc.Find(".fa.fa-steam").Parent().Attr("href")
	steamId := utils.FindUInt32(steamHref)

	return model.Steam{Href: steamHref, SteamRefID: steamId}

}
