import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import io from "socket.io-client";
import Home from "./Components/Home"
import reportWebVitals from "./reportWebVitals";

const socket = io();

// At start, attempt to join the room ID from the URL
let roomId = window.location.pathname + window.location.search;
roomId = roomId.substring(1);
if (roomId.length > 1) {
  joinRoom(roomId);
}

function createRoom() {
  socket.emit("createRoom");
}

function joinRoom(roomId) {
  socket.emit("joinRoom", roomId);
}

function redirect(id) {
  window.location.href = id;
}

// For debug
socket.on("log", (msg) => {
  console.log(msg);
});

// Redirect URL (e.g. when client creates room)
socket.on("redirect", (id) => {
  redirect(id);
});

ReactDOM.render(
  <React.StrictMode>
    <Home socket = {socket}
    createRoom = {createRoom}
    joinRoom = {joinRoom}
    redirect = {redirect}
    />
  </React.StrictMode>,
  document.getElementById("root")
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
