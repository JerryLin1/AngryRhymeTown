import React from "react";
import { Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [{ name: "Loading", score: "Loading" },
      { name: "Loading", score: "Loading" },
      { name: "Loading", score: "Loading" }], 
      otherRappers: []
    }

    this.props.socket.on("sendResults", results => {
      this.setState({ results: results });
      this.setState({otherRappers: this.generateOtherRappers()});
    })
  }

  generateOtherRappers = () => {
    let otherRappers = [];
    for (let i = 3; i < this.state.results.length; i++) {
      otherRappers.push(
        <Row>
          <Col xs="8">{i + 1}. {this.state.results[i].name}</Col>
          <Col>{this.state.results[i].score}</Col>
        </Row>
      )
    }
    return otherRappers;
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
