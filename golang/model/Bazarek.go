package model

import (
	"gorm.io/gorm"
	"time"
)

type Bazarek struct {
	gorm.Model
	BazarekID uint
	Name      string
	Price     float32
	Offers    uint8
	UpdatedAt time.Time
	SteamID   uint
}
