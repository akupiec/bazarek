package model

import (
	"time"
)

type Bazarek struct {
	ID        uint   `gorm:"primaryKey"`
	BazarekID uint   `gorm:"uniqueIndex"`
	Href      string `gorm:"unique"`
	Name      string
	Price     float32
	Offers    uint8
	Updated   time.Time
	SteamID   *uint `gorm:"uniqueIndex"`
}
