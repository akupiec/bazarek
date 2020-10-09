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

func BazarekSteamId(db *gorm.DB) {
	bazareks := needUpdate(db)
	p := make(chan struct{}, POOL_SIZE)
	var wg sync.WaitGroup

	utils.StartProgress(len(bazareks))
	for i := 0; i < len(bazareks); i++ {
		wg.Add(1)
		go func(game model.Bazarek) {
			p <- struct{}{}
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
			}
			game.Updated = time.Now()
			db.Save(&game)
			logrus.Debugf("game id: %d save done!", game.BazarekID)
			<-p
			utils.ShowProgress(100)
			wg.Done()
		}(bazareks[i])
	}
	wg.Wait()
}

func needUpdate(db *gorm.DB) []model.Bazarek {
	var results []model.Bazarek
	db.Model(model.Bazarek{}).Where("steam_id IS NULL").Find(&results)
	return results
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
