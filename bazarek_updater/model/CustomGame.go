package model

type GameType string

const (
	GameLove     GameType = "Love"
	GameHate     GameType = "Hate"
	GameOwn      GameType = "Own"
	GameGiveAway GameType = "GiveAway"
)

type CustomGame struct {
	Game   *Game
	ID     uint    `gorm:"primarykey"`
	GameID *uint32 `gorm:"index"`
	Type   GameType
	UserId uint64
}

func GetGameTypes() []GameType {
	types := []GameType{GameLove, GameHate, GameOwn, GameGiveAway}
	return types
}

func CheckGameType(str string) bool {
	for _, g := range GetGameTypes() {
		if str == string(g) {
			return true
		}
	}
	return false
}
