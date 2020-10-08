package utils

import (
	"regexp"
	"strconv"
	"strings"
)

var re = regexp.MustCompile(`\d+`)
var ref = regexp.MustCompile(`\d+[,.]\d*`)

func FindInt(s string) int {
	n, _ := strconv.Atoi(re.FindString(s))
	return n
}

func FindFloat32(s string) float32 {
	str := ref.FindString(s)
	all := strings.ReplaceAll(str, ",", ".")
	n, _ := strconv.ParseFloat(all, 32)
	return float32(n)
}

func FindUInt8(s string) uint8 {
	n, _ := strconv.Atoi(re.FindString(s))
	return uint8(n)
}
