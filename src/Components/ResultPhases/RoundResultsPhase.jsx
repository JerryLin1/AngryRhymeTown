import React from "react";
import { Row, Col } from "react-bootstrap";
import { Award } from "react-bootstrap-icons";
import game from "../Game.module.css";

export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = {
      results: [{ name: "Loading", score: "Loading" },
      { name: "Loading", score: "Loading" },
      { name: "Loading", score: "Loading" }],
      otherRappers: [],
      round: ""
    }

    this.socket.on("sendRoundResults", (results, round) => {
      this.setState({ results: results });
      this.setState({ round: round });

      let otherRappers = [];
      for (let i = 0; i < results.length; i++) {
        otherRappers.push(
          <Row>
            <Col xs="8">
              {i + 1}. {results[i].name}
              {(i == 0) ? <Award style={{ color: "#d4af37" }}/> : ""}
              {(i == 1) ? <Award style={{ color: "#C0C0C0" }}/> : ""}
              {(i == 2) ? <Award style={{ color: "#cd7f32" }}/> : ""}
            </Col>

            {/* TODO: Roseak make font smaller here */}
            <Col xs = "4">{results[i].score} points 
              {
                (results[i].wordBonuses == 0) ?
                  " (no points from word bonuses)"
                  :
                  " (" + results[i].wordBonuses + " points from word bonuses)"
              }
            </Col>
          </Row>
        )
      }

      this.setState({ otherRappers: otherRappers });
    })
  }

  render() {
    return (
      <div>
        <div className={`${game.header}`}>
          Here are the results for round {this.state.round}!
        </div>

        <br />

        <div id={`${game.rapperList}`}>
          {this.state.otherRappers}
        </div>
      </div>
    );
  }
}