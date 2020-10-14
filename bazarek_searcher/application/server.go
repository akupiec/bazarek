package application

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"net/http"
)

var db *gorm.DB

func Host(_db *gorm.DB) {
	db = _db
	http.HandleFunc("/", finder)
	logrus.Info("Server running at http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	logrus.Fatal(err)
}
