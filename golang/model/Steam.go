package model

type SteamType string

const (
	Game        SteamType = "Game"
	Bundle      SteamType = "Bundle"
	Application SteamType = "Application"
)

type Steam struct {
	ID           uint32 `gorm:"primarykey"`
	SteamRefID   uint32 `gorm:"unique"`
	Name         *string
	Href         string
	Bazarek      *Bazarek
	Price        *float32
	SteamType    *SteamType
	Tags         []Tag      `gorm:"many2many:steam_tag;"`
	Category     []Category `gorm:"many2many:steam_category;"`
	ReviewsCount *uint16
	//UpdatedAt    time.Time
}
