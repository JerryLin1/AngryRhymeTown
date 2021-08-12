import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./Components/Home";
import Lobby from "./Components/Lobby";
import Game from "./Components/Game"
import reportWebVitals from "./reportWebVitals";
import Client from './client.js';
import tts from "./tts";
import 'bootstrap/dist/css/bootstrap.min.css';
import sounds from "./sounds.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";

class Director extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client({ switchState: this.switchState, match: props.match });
  }

  render() {
    return (
      <div className="game_wrapper">
        <Switch>
          <Route path="/" exact>
            <Home client={this.client} />
          </Route>
          <Route path="/game">
              <Game client={this.client} />
            </Route>
          <Route path="/:roomId" render={(props) => (<Lobby client={this.client} match={props.match} />)}>

          </Route>
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Route render={(props) => (<Director match={props} />)} />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
