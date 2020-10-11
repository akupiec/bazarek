package update

import (
	"arkupiec/bazarek/application/utils"
	"arkupiec/bazarek/model"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm/clause"
	"strings"
	"sync"
	"time"
)

func BazarekSteamId() {
	bazareks := needUpdate()
	p := make(chan struct{}, POOL_SIZE)
	var wg sync.WaitGroup

	utils.StartProgress(len(bazareks))
	for _, ba := range bazareks {
		wg.Add(1)
		go func(game model.Bazarek) {
			p <- struct{}{}
			steamGame := fetchGameInfo(&game)
			<-p
			saveGameInfo(steamGame)
			utils.ShowProgress(100)
			wg.Done()
		}(ba)
	}
	wg.Wait()
}

func saveGameInfo(st model.Steam) {
	if st.Href != "" {
		db.Clauses(clause.OnConflict{DoNothing: true}).Create(&st)
		if st.ID == 0 {
			db.Where("steam_ref_id = ?", st.SteamRefID).First(&st)
		}
		if st.ID == 0 {
			panic("what do you think you are doing!")
		}
		st.Bazarek.SteamID = &st.ID
	}
	st.Bazarek.Updated = time.Now()
	db.Save(st.Bazarek)
	logrus.Debugf("game id: %d save done!", st.Bazarek.BazarekID)
}

func needUpdate() []model.Bazarek {
	var results []model.Bazarek
	db.Model(model.Bazarek{}).Where("steam_id IS NULL").Find(&results)
	return results
}

func fetchGameInfo(ba *model.Bazarek) model.Steam {
	err, doc := utils.Fetch("https://bazar.lowcygier.pl" + ba.Href)
	if err != nil {
		logrus.Error(err)
		return model.Steam{}
	}
	steamHref, _ := doc.Find(".fa.fa-steam").Parent().Attr("href")
	steamType := getSteamType(steamHref)
	steamId := utils.FindUInt32(steamHref)

	return model.Steam{Href: steamHref, SteamRefID: steamId, Bazarek: ba, SteamType: &steamType}
}

func getSteamType(href string) model.SteamType {
	if strings.Contains(href, string(model.Game)) {
		return model.Game
	}
	if strings.Contains(href, string(model.Application)) {
		return model.Application
	}
	return model.Bundle
}
