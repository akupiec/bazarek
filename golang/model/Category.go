package model

type Category struct {
	ID   uint   `gorm:"primarykey"`
	Name string `gorm:"unique"`
}
