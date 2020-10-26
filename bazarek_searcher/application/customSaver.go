package application

import (
	"arkupiec/bazarek_searcher/repository"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

type saverBody struct {
	User    uint64 `json:"user"`
	TypeStr string `json:"type"`
}

func customSaver(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	id := c.Param("id")
	var body saverBody
	json.NewDecoder(c.Request.Body).Decode(&body)

	err := repository.CustomSave(id, body.User, body.TypeStr)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	c.JSON(200, "ok")
}
