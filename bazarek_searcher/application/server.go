package application

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"net/http"
	"time"
)

var db *gorm.DB

func Host(_db *gorm.DB) {
	db = _db
	http.HandleFunc("/finder", finder)
	http.HandleFunc("/toPick", toPick)
	logrus.Info("Server running at http://localhost:9090")
	s := &http.Server{
		Addr:           ":9090",
		Handler:        nil,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   5 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	logrus.Fatal(s.ListenAndServe())
}
