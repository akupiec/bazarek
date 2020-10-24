package model

import "time"

type SteamType string

const (
	SteamGame   SteamType = "Game"
	SteamBundle SteamType = "Bundle"
	SteamSub    SteamType = "Sub"
	Missing     SteamType = "Missing"
	Error       SteamType = "Error"
)

type Steam struct {
	ID         uint32 `gorm:"primarykey"`
	SteamRefID uint32 `gorm:"unique"`
	SteamType  SteamType
	Href       string `gorm:"unique"`
	Price      *float32
	Updated    time.Time
}
