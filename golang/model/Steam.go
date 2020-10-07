package model

import (
	"gorm.io/gorm"
)

type Steam struct {
	gorm.Model
	SteamRefID   int `gorm:"unique"`
	Name         string
	Href         string
	Bazarek      Bazarek
	Price        float32
	Tags         []Tag      `gorm:"many2many:steam_tag;"`
	Category     []Category `gorm:"many2many:steam_category;"`
	ReviewsCount uint16
	//UpdatedAt    time.Time
}
