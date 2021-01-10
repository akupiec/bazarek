package server

import (
	"arkupiec/bazarek_updater/model"
	"arkupiec/bazarek_updater/repository"
	"github.com/gin-gonic/gin"
)

type ToPick struct {
	Tag      []model.Tag
	Category []model.Category
	Review   []model.Review
	GameType []model.GameType
}

func toPick(c *gin.Context) {
	db := repository.DB
	c.Header("Cache-Control", "max-age=3600")

	resp := ToPick{GameType: model.GetGameTypes()}
	db.Model(model.Tag{}).Find(&resp.Tag)
	db.Model(model.Category{}).Find(&resp.Category)
	db.Model(model.Review{}).Find(&resp.Review)

	c.JSON(200, resp)
}
