package utils

import (
	"os"
	"os/signal"
	"syscall"
)

func HandleSigterm(atEnd func()) {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		atEnd()
		os.Exit(1)
	}()
}
