package main

import "net/http"

func main() {
	setupApi()
}
func setupApi() {
	http.Handle("/", http.FileServer(http.Dir("./frontend")))
}
