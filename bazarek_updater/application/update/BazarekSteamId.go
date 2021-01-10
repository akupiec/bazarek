package update

import (
	"arkupiec/bazarek_updater/application/utils"
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository/services"
	"github.com/sirupsen/logrus"
	"strings"
	"sync"
)

func BazarekSteamId() {
	toSave := getGameDataToSave()
	services.SaveGameNameWithSteam(toSave)
}

func getGameDataToSave() chan model.Game {
	games := services.GetGamesWithMissingSteamsEager()
	toSave := make(chan model.Game, len(games))
	p := make(chan struct{}, FETCH_POOL_SIZE)
	var wg sync.WaitGroup

	utils.StartProgress(len(games))
	for _, ba := range games {
		wg.Add(1)
		go func(game model.Game) {
			p <- struct{}{}
			fetchGameInfo(&game)
			toSave <- game
			<-p
			utils.ShowProgress(100)
			wg.Done()
		}(ba)
	}
	wg.Wait()

	close(toSave)
	return toSave
}

func fetchGameInfo(game *model.Game) {
	err, doc := utils.Fetch("https://bazar.lowcygier.pl" + game.Bazarek.Href)
	if err != nil {
		re := err.(*utils.FetchError)
		if re.Res != nil && re.Res.StatusCode == 403 {
			logrus.Warn(err)
		} else {
			logrus.Error(err)
		}
		return
	}
	steamHref, _ := doc.Find(".fa.fa-steam").Parent().Attr("href")
	steamType := getSteamType(steamHref)
	steamId := utils.FindUInt32(steamHref)
	steam := model.Steam{Href: steamHref, SteamRefID: steamId, SteamType: steamType}
	game.Steam = &steam
}

func getSteamType(href string) model.SteamType {
	if strings.Contains(href, "app") {
		return model.SteamGame
	}
	if strings.Contains(href, "bundle") {
		return model.SteamBundle
	}
	if strings.Contains(href, "sub") {
		return model.SteamSub
	}
	return ""
}
