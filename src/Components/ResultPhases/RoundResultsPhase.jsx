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
      results: [
        { name: "Loading", score: "Loading" },
        { name: "Loading", score: "Loading" },
        { name: "Loading", score: "Loading" },
        { name: "Loading", score: "Loading" },
        { name: "Loading", score: "Loading" },
      ],
      otherRappers: ["A", "B", "C"],
      round: "",
    };

    this.socket.emit("receiveRoundResults", (roundResults) => {
      this.setState({ results: roundResults.results });
      this.setState({ round: roundResults.round });

      let otherRappers = [];
      for (let i = 0; i < roundResults.results.length; i++) {
        otherRappers.push(
          <Row>
            <Col xs="8">
              {i + 1}. {roundResults.results[i].name}
              {i == 0 ? <Award style={{ color: "#d4af37" }} /> : ""}
              {i == 1 ? <Award style={{ color: "#C0C0C0" }} /> : ""}
              {i == 2 ? <Award style={{ color: "#cd7f32" }} /> : ""}
            </Col>

            <Col xs="4">
              <span>{roundResults.results[i].score} points </span>
              <span style={{ fontSize: "0.5em" }}>
                {roundResults.results[i].wordBonuses == 0
                  ? " (No points from word bonuses)"
                  : " (" +
                  roundResults.results[i].wordBonuses +
                  " point(s) from word bonuses)"}
              </span>
            </Col>
          </Row>
        );
      }

      this.setState({ otherRappers: otherRappers });
    });
  }

  render() {
    return (
      <div>
        <div className={`${game.header}`}>
          Here are the results for round {this.state.round}!
        </div>

        <br />

        <div id={`${game.rapperList}`}>{this.state.otherRappers}</div>
      </div>
    );
  }
}
