package utils

import (
	"github.com/PuerkitoBio/goquery"
	"github.com/hashicorp/go-retryablehttp"
	"github.com/sirupsen/logrus"
	"log"
	"net/http"
	"time"
)

func FetchBasic(u string, min time.Duration, max time.Duration, retry int) (error, *goquery.Document) {
	client := retryablehttp.NewClient()
	client.RequestLogHook = func(_ retryablehttp.Logger, req *http.Request, attempt int) {
		logrus.WithFields(logrus.Fields{
			//"request": map[string]string{
			//	"proto": req.Proto,
			//	"host":  req.URL.Host,
			//"URL":  req.URL.Query().Encode(),
			//},
			"url":     req.URL,
			"attempt": attempt,
		}).Info("Sending request")
	}
	client.Logger = nil
	client.Backoff = retryablehttp.LinearJitterBackoff
	client.RetryWaitMin = min
	client.RetryWaitMax = max
	client.RetryMax = retry
	client.ErrorHandler = retryablehttp.PassthroughErrorHandler

	res, err := client.Get(u)
	if err != nil {
		log.Fatalln(err)
	}
	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)

	}

	defer res.Body.Close()
	doc, err := goquery.NewDocumentFromReader(res.Body)
	return err, doc
}

func Fetch(u string) (error, *goquery.Document) {
	return FetchBasic(u, 500*time.Millisecond, 800*time.Millisecond, 5)
}
