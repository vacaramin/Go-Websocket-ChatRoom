var selectedChat = "general";
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
    conn.send(newMessage.value)
  }
  return false;
}
window.onload = function(){
  document.getElementById("chatroom-selection").onsubmit = changeChatRoom
  document.getElementById("chatroom-message").onsubmit = sendMessage
  if(window["WebSocket"]){
      //connect ws
      console.log("websocket Supported")
      conn = new WebSocket("ws://" +document.location.host + "/ws")
  }else{
      console.log("Browswer doesn't support websocket")
  }

}