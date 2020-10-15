package application

import (
	"arkupiec/bazarek_searcher/model"
	"encoding/json"
	"github.com/sirupsen/logrus"
	"net/http"
)

type ToPick struct {
	Tag      []model.Tag
	Category []model.Category
	Review   []model.Review
}

func toPick(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	resp := ToPick{}
	db.Model(model.Tag{}).Find(&resp.Tag)
	db.Model(model.Category{}).Find(&resp.Category)
	db.Model(model.Review{}).Find(&resp.Review)

	er := json.NewEncoder(w).Encode(&resp)
	if er != nil {
		logrus.Fatal(er)
	}
}
