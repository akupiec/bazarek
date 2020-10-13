package utils

import "github.com/sirupsen/logrus"

var total = 0

func StartProgress(max int) {
	total = max
	logrus.Infof("total progress: %d", total)
}

func ShowProgress(step int) {
	total--
	if total%step == 0 {
		logrus.Infof("progress remaining: %d", total)
	}
}
