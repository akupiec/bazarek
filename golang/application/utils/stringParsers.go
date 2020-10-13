package utils

import (
	"regexp"
	"strconv"
	"strings"
)

var re = regexp.MustCompile(`\d+`)
var ref = regexp.MustCompile(`\d+[,.]\d*`)
var res = regexp.MustCompile(`\d+[,.]?\d*`)

func FindInt(s string) int {
	n, _ := strconv.Atoi(re.FindString(s))
	return n
}

func FindIntSeparated(s string) int {
	str := res.FindString(s)
	all := strings.ReplaceAll(str, ",", "")
	n, _ := strconv.Atoi(all)
	return n
}

func FindFloat32(s string) float32 {
	str := ref.FindString(s)
	all := strings.ReplaceAll(str, ",", ".")
	n, _ := strconv.ParseFloat(all, 32)
	return float32(n)
}

func FindUInt32(s string) uint32 {
	return uint32(FindInt(s))
}

func FindUInt8(s string) uint8 {
	return uint8(FindInt(s))
}
