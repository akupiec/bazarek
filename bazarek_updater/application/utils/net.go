package utils

import (
	"context"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/hashicorp/go-retryablehttp"
	"github.com/sirupsen/logrus"
	"net/http"
	"time"
)

type hookLogger struct {
	retryablehttp.LeveledLogger
}

func (h hookLogger) Info(s string, args ...interface{}) {
	logrus.Infof(s, args)
}
func (h hookLogger) Error(s string, args ...interface{}) {
	logrus.Errorf(s, args)
}
func (h hookLogger) Warn(s string, args ...interface{}) {
	logrus.Warnf(s, args)
}
func (h hookLogger) Debug(s string, args ...interface{}) {
	logrus.Debugf(s, args)
}

func FetchBasic(u string, min time.Duration, max time.Duration, retry int) (error, *goquery.Document) {
	client := createClient(min, max, retry)

	res, err := client.Get(u)
	return parseResp(err, res)
}

func parseResp(err error, res *http.Response) (error, *goquery.Document) {
	if err != nil {
		logrus.Fatalln(err)
	}
	if res.StatusCode != 200 {
		return fmt.Errorf("status code error: %s %s", res.Status, res.Request.URL), nil
	}

	defer res.Body.Close()
	doc, err := goquery.NewDocumentFromReader(res.Body)
	return err, doc
}

func createClient(min time.Duration, max time.Duration, retry int) *retryablehttp.Client {
	client := retryablehttp.NewClient()
	client.RequestLogHook = func(_ retryablehttp.Logger, req *http.Request, attempt int) {
		logrus.WithFields(logrus.Fields{
			"url":     req.URL,
			"attempt": attempt,
		}).Debug("Sending request")
	}

	client.Logger = hookLogger{}
	client.Backoff = retryablehttp.LinearJitterBackoff
	client.RetryWaitMin = min
	client.RetryWaitMax = max
	client.RetryMax = retry
	client.CheckRetry = func(ctx context.Context, resp *http.Response, err error) (bool, error) {
		// do not retry on context.Canceled or context.DeadlineExceeded
		if ctx.Err() != nil {
			return false, ctx.Err()
		}

		if err != nil {
			return true, fmt.Errorf("unexpected HTTP error %v", err)
		}

		if resp.StatusCode != 200 && resp.StatusCode != 403 {
			return true, fmt.Errorf("unexpected HTTP status %s", resp.Status)
		}

		return false, nil
	}
	return client
}

func Fetch(u string) (error, *goquery.Document) {
	return FetchBasic(u, 500*time.Millisecond, 800*time.Millisecond, 5)
}

func GetWithCookie(url string, cookie string) (error, *goquery.Document) {
	req, _ := retryablehttp.NewRequest("GET", url, nil)
	client := createClient(500*time.Millisecond, 800*time.Millisecond, 5)
	req.Header.Set("Cookie", cookie)
	res, err := client.Do(req)
	return parseResp(err, res)
}
