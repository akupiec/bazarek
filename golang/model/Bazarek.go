package model

import (
	"time"
)

type Bazarek struct {
	ID        uint32 `gorm:"primaryKey"`
	BazarekID uint32 `gorm:"uniqueIndex"`
	Href      string `gorm:"unique"`
	Name      string
	Price     float32
	Offers    uint8
	Updated   time.Time
	SteamID   *uint32 `gorm:"uniqueIndex"`
}
