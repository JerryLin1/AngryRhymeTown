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

import PairingPhase from "./Components/GamePhases/PairingPhase.jsx";
import WritingPhase from "./Components/GamePhases/WritingPhase.jsx";
import RappingPhase from "./Components/GamePhases/RappingPhase.jsx";
import VotingPhase from "./Components/GamePhases/VotingPhase.jsx";

import RoundResultsPhase from "./Components/ResultPhases/RoundResultsPhase.jsx";
import GameResultsPhase from "./Components/ResultPhases/GameResultsPhase.jsx";

import { BrowserRouter, Route, MemoryRouter, Switch } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { GenerateName } from "./assets/nameGenerator";

class Director extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client({ switchState: this.switchState, match: props.match });
    localStorage.setItem("defaultNickname", GenerateName());
    // let roomId = props.match.match.params.roomId || "";
    // this.client.joinRoom(roomId);
  }

  render() {
    return (
      <div >
        <Switch>
          <Route path="/:roomId?" exact render={(props) => (<Home client={this.client} match={props.match} />)} />
          <Route path="/:roomId/lobby" exact render={(props) => (<Lobby client={this.client} match={props.match} />)} />
          <Route path="/:roomId/pairing" render={() => (<PairingPhase client={this.client} />)} />
          <Route path="/:roomId/writing" render={() => (<WritingPhase client={this.client} />)} />
          <Route path="/:roomId/rapping" render={() => (<RappingPhase client={this.client} />)} />
          <Route path="/:roomId/voting" render={() => (<VotingPhase client={this.client} />)} />
          <Route path="/:roomId/roundresults" render={() => (<RoundResultsPhase client={this.client} />)} />
          <Route path="/:roomId/gameresults" render={() => (<GameResultsPhase client={this.client} />)} />
        </Switch>
      </div>
    );
  }
}

ReactDOM.render(
  <MemoryRouter>
    <Route render={(props) => (<Director match={props} />)} />
  </MemoryRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
