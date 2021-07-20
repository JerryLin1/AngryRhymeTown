import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./Components/Home";
import Lobby from "./Components/Lobby";
import reportWebVitals from "./reportWebVitals";
import Client from './client.js';

let client = new Client();

ReactDOM.render(
  director(),
  document.getElementById("root")
);

function director() {
  if (window.location.pathname + window.location.search === "/") {
    return <Home client = {client}/>;
  } else {
    return <Lobby client = {client} room = {client.room}/>;
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
