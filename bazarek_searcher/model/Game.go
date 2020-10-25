package model

type Game struct {
	Steam   *Steam
	Bazarek *Bazarek
	Review  *Review

	ID           uint `gorm:"primarykey"`
	Name         string
	SteamID      *uint32    `gorm:"unique;index"`
	BazarekID    *uint32    `gorm:"unique;index"`
	ReviewID     *uint32    `gorm:"index"`
	Tags         []Tag      `gorm:"many2many:steam_tag;"`
	Category     []Category `gorm:"many2many:steam_category;"`
	ReviewsCount *uint16
	Price        *float32
}
