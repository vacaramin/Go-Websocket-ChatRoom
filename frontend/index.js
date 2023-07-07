var selectedChat = "general";

class Event{
  constructor(type,payload) {
    this.type = type;
    this.payload = payload;
  }
}

function routeEvent(event){
  if (event.type === undefined){
    alert('no type field in the event')
  }
  switch(event.type){
    case "new_message":
      console.log("new Message");
    default:
      alert("unsupported message type");
      break;
  }
}
function sendEvent(eventName,payload){
  const event = new Event(eventName,payload);
  conn.send(JSON.stringify(event))
}
function changeChatRoom() {
  var newChat = document.getElementById("chatroom");
  if (newChat != null && newChat.value != selectedChat) {
    console.log(newChat);
  }
  return false;
}

function sendMessage() {
  var newMessage = document.getElementById("message");
  if (newMessage != null) {
    console.log(newMessage.value)
    sendEvent("send_message", newMessage.value)
  }
  return false;
}

function login(){
let formData = {
  "username": document.getElementById("username").value,
  "password": document.getElementById("password").value
}
fetch("login",{
  method: 'post',
  body: JSON.stringify(formData),
  mode:'cors'
}).then((response) => {
  if(response.ok){
    return response.json();
  }else {
    throw "unauthorized";
  }
  }).then((data)=>{
    //we are authenticated
  connectWebsocket(data.otp)
  }).catch((e) => {alert(e)});
return false


}
function connectWebsocket(otp){

    if(window["WebSocket"]){
      //connect ws
      console.log("websocket Supported")
      conn = new WebSocket("ws://" +document.location.host + "/ws?otp=",otp)
      conn.onopen = function (evt){
        document.getElementById("connection-header").innerHTML = "Connected to websocket = true"
      }
      conn.onclose = function (evt){
        document.getElementById("connection-header").innerHTML = "Connected to websocket = false"
        //reconnect
      }
      conn.onmessage= function(evt){
        const eventData = JSON.parse(evt.data);
        const event = Object.assign(new Event, eventData)
        routeEvent(event)
      }
    }else{
      console.log("Browswer doesn't support websocket")
    }

  }
window.onload = function() {
  document.getElementById("chatroom-selection").onsubmit = changeChatRoom
  document.getElementById("chatroom-message").onsubmit = sendMessage
  document.getElementById("login-form").onsubmit = login
}
