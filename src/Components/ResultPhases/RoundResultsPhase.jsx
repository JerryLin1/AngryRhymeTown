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
      this.setState({round: round});
      
      let otherRappers = [];
      for (let i = 3; i < results.length; i++) {
        otherRappers.push(
          <Row>
            <Col xs="8">
              {i+1}. {results[i].name}
            </Col>
            <Col>{results[i].score} points</Col>
          </Row>
        )
      }

      this.setState({otherRappers: otherRappers});
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
          <Row>
            <Col xs="8">
              1. {this.state.results[0].name} <Award style={{ color: "#d4af37" }} />
            </Col>
            <Col>{this.state.results[0].score} points</Col>
          </Row>
          <Row>
            <Col xs="8">
              2. {this.state.results[1].name} <Award style={{ color: "#C0C0C0" }} />
            </Col>
            <Col>{this.state.results[1].score} points</Col>
          </Row>
          <Row>
            <Col xs="8">
              3. {this.state.results[2].name} <Award style={{ color: "#cd7f32 " }} />
            </Col>
            <Col>{this.state.results[2].score} points</Col>
          </Row>
          {this.state.otherRappers}
        </div>
      </div>
    );
  }
}