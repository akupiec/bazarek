package model

import "time"

type SteamType string

const (
	SteamGame   SteamType = "Game"
	SteamBundle SteamType = "Bundle"
	SteamSub    SteamType = "Sub"
)

type Steam struct {
	ID               uint32 `gorm:"primarykey"`
	SteamRefID       uint32 `gorm:"unique"`
	Name             *string
	Href             string
	Bazarek          *Bazarek
	Price            *float32
	SteamType        SteamType
	Tags             []Tag      `gorm:"many2many:steam_tag;"`
	Category         []Category `gorm:"many2many:steam_category;"`
	Review           []Review   `gorm:"many2many:steam_review;"`
	ReviewsCount     *uint16
	LastReviewsCount *uint16

	Updated time.Time
}
