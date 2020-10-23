package model

import (
	"time"
)

type Bazarek struct {
	ID           uint32 `gorm:"primaryKey"`
	BazarekRefID uint32 `gorm:"uniqueIndex"`
	Href         string `gorm:"unique"`
	Price        float32
	Offers       uint8
	Updated      time.Time
}
