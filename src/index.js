import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./Components/Home";
import Lobby from "./Components/Lobby";
import reportWebVitals from "./reportWebVitals";
import Client from './client.js';
import tts from "./tts";
import 'bootstrap/dist/css/bootstrap.min.css';

let client = new Client();

ReactDOM.render(
  director(),
  document.getElementById("root")
);

function director() {
  tts.rap([
    "Hey my name is Jerry Lin",
    "Everyday I only win",
    "Every time I get that dub",
    "I take a bath inside my tub"
  ])
  if (window.location.pathname + window.location.search === "/") {
    return <Home client = {client}/>;
  } else {
    return <Lobby client = {client}/>;
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
