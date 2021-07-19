import React from "react";
import ReactDOM from "react-dom";
import { io } from "socket.io-client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
var socket;
function App() {
  socket = io();

  // At start, attempt to join the room ID from the URL
  let roomId = window.location.pathname + window.location.search;
  roomId = roomId.substring(1);
  if (roomId.length > 1) {
    JoinRoom(roomId);
  }

  // For debug
  socket.on("log", (msg) => {
    console.log(msg);
  });

  // Redirect URL (e.g. when client creates room)
  socket.on("redirect", (id) => {
    Redirect(id);
  });

  return (
    <div className="App">
      ANGRY RHYME TOWN
      <BtnCreateRoom />
      <FormJoinRoom />
    </div>
  );
}
// Create the room, then redirect URL to that room
function CreateRoom() {
  socket.emit("createRoom");
}
function JoinRoom(roomId) {
  socket.emit("joinRoom", roomId);
}
function BtnCreateRoom() {
  return (
    <div>
      <button onClick={CreateRoom}>Create lobby</button>
    </div>
  );
}

function FormJoinRoom() {
  return (
    <div>
      <input id="inputRoomID" type="text" />
      <button
        onClick={() => {
          console.log(document.getElementById("inputRoomID").value);
          Redirect(document.getElementById("inputRoomID").value);
        }}
      >
        Join Room
      </button>
    </div>
  );
}
function Redirect(id) {
  window.location.href = id;
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
