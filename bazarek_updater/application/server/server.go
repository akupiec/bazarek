package server

import (
	"arkupiec/bazarek_updater/repository/services"
	"encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"time"
)

func Host() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           5 * time.Hour,
	}))
	r.GET("/finder", finder)
	r.GET("/toPick", toPick)
	r.POST("/saveCustom/:id", customSaver)
	logrus.Info("Server running at http://localhost:9090")
	r.Run(":9090")
}

type saverBody struct {
	User    uint64 `json:"user"`
	TypeStr string `json:"type"`
}

func customSaver(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	id := c.Param("id")
	var body saverBody
	json.NewDecoder(c.Request.Body).Decode(&body)

	err := services.CustomSave(id, body.User, body.TypeStr)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}
	c.JSON(200, "ok")
}
