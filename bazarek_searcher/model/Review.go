package model

type Review struct {
	ID   uint   `gorm:"primarykey"`
	Name string `gorm:"unique"`
}
