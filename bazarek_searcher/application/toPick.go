package application

import (
	"arkupiec/bazarek_searcher/model"
	"github.com/gin-gonic/gin"
)

type ToPick struct {
	Tag      []model.Tag
	Category []model.Category
	Review   []model.Review
	GameType []model.GameType
}

func toPick(c *gin.Context) {
	c.Header("Cache-Control", "max-age=3600")

	resp := ToPick{GameType: model.GetGameTypes()}
	db.Model(model.Tag{}).Find(&resp.Tag)
	db.Model(model.Category{}).Find(&resp.Category)
	db.Model(model.Review{}).Find(&resp.Review)

	c.JSON(200, resp)
}
