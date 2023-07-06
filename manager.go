package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	webSocketUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

type Manager struct {
	client ClientList
	sync.RWMutex
	handlers map[string]EventHandler
}

func NewManager() *Manager {
	return &Manager{
		client:   make(ClientList),
		handlers: make(map[string]EventHandler),
	}
}

func (m *Manager) setupEventHandlers() {
	m.handlers[EventSendMessage] = SendMessage
}
func SendMessage(event Event, c *Client) error {
	fmt.Println(event)
	return nil
}
func (m *Manager) routeEvent(event Event, c *Client) error {
	if handler, ok := m.handlers[event.Type]; ok {
		if err := handler(event, c); err != nil {
			return err
		}
		return nil
	} else {
		return errors.New("there is no such event")
	}
}
func (m *Manager) serveWs(w http.ResponseWriter, r *http.Request) {
	log.Println("New Connection")
	//Upgrade Regular HTTP to Websocket
	conn, err := webSocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := NewClient(conn, m)
	m.addClient(client)

	//start client messages
	go client.readMessages()
	go client.writeMessages()
}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	m.client[client] = true
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	if _, ok := m.client[client]; ok {
		client.connection.Close()
		delete(m.client, client)
	}
	m.client[client] = false
}
