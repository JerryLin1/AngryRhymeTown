import React from "react";
import { Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = {
      results: [{ name: "Loading", score: "Loading" },
      { name: "Loading", score: "Loading" },
      { name: "Loading", score: "Loading" }],
      otherRappers: []
    }

    this.socket.on("sendGameResults", results => {
      this.setState({ results: results });

      let otherRappers = [];
      for (let i = 3; i < results.length; i++) {
        otherRappers.push(
          <Row style={{ backgroundColor: i > 2 ? "#96ceff" : "#fff" }}>
            <Col xs="8">{i + 1}. {results[i].name}</Col>
            <Col>{results[i].score}</Col>
          </Row>
        )
      }
      this.setState({ otherRappers: otherRappers });
    })
  }

  render() {
    return (
      <div>
        <div className={`${game.header}`}>GGWP!</div>
        <div id={`${game.podium}`}>
          <div id={`${game.secondP}`}>
            <strong>2nd</strong>
            <div>{this.state.results[1].name}</div>
            <div>{this.state.results[1].score}</div>
          </div>
          <div id={`${game.firstP}`}>
            <strong>1st</strong>
            <div>{this.state.results[0].name}</div>
            <div>{this.state.results[0].score}</div>
          </div>
          <div id={`${game.thirdP}`}>
            <strong>3rd</strong>
            <div>{this.state.results[2].name}</div>
            <div>{this.state.results[2].score}</div>
          </div>
        </div>

        <div id={game.rapperList}>
          {this.state.otherRappers}
        </div>
      </div>
    );
  }
}
