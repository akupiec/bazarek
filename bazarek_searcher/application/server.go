package application

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"net/http"
)

var db *gorm.DB

func Host(_db *gorm.DB) {
	db = _db
	http.HandleFunc("/finder", finder)
	http.HandleFunc("/toPick", toPick)
	logrus.Info("Server running at http://localhost:9090")
	err := http.ListenAndServe(":9090", nil)
	logrus.Fatal(err)
}
