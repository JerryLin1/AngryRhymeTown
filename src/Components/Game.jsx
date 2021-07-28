import React from "react";

import PairingPhase from "./GamePhases/PairingPhase.jsx";
import WritingPhase from "./GamePhases/WritingPhase.jsx";
import VotingPhase from "./GamePhases/VotingPhase.jsx";

import VotingResultsPhase from "./ResultPhases/VotingResultsPhase.jsx";
import RoundResultsPhase from "./ResultPhases/RoundResultsPhase.jsx";
import GameResultsPhase from "./ResultPhases/GameResultsPhase.jsx";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.state = { phase: "Pairing" };
    this.switchPhase = this.switchPhase.bind(this);
    this.client.switchPhase = this.switchPhase;
  }

  switchPhase = (newPhase) => {
    this.setState({ phase: newPhase });
  };

  setPhase = () => {
    if (this.state.phase === "Pairing") {
      return <PairingPhase socket={this.client.socket} roomSettings={this.client.roomSettings}/>;
    } else if (this.state.phase === "Writing") {
      return <WritingPhase socket={this.client.socket} roomSettings={this.client.roomSettings}/>;
    } else if (this.state.phase === "Voting") {
      return <VotingPhase client = {this.client} roomSettings={this.client.roomSettings}/>;
    } else if (this.state.phase == "VotingResults") {
    return <VotingResultsPhase />;
    } else if (this.state.phase == "RoundResults") {
    return <RoundResultsPhase />;
    } else if (this.state.phase == "GameResults") {
      return <GameResultsPhase />;
    }
  };

  ////////////////// REMEMBER TO CHANGE INDEX.JS BACK //////////////////
  render() {
    return <div className="game">{this.setPhase()}</div>;
  }
}
