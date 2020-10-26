package application

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"time"
)

var db *gorm.DB

func Host(_db *gorm.DB) {
	db = _db
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
