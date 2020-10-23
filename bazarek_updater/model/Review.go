package model

type Review struct {
	ID   uint32 `gorm:"primarykey"`
	Name string `gorm:"unique"`
}
