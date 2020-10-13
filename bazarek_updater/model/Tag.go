package model

type Tag struct {
	ID   uint   `gorm:"primarykey"`
	Name string `gorm:"unique"`
}
