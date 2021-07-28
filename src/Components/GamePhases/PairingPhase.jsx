import React from "react";
import Countdown from "../Countdown.jsx";
import { Card, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class PairingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.matchups = [];
    this.props.socket.on("startPairPhase", (pairs, pairDisplay) => {
      for (let pair of pairDisplay) {
        this.matchups.push(
          <Card.Body>{`${pair[0]} vs. ${pair[1]}`}</Card.Body>
        );
      }
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        <Row>
          {/* Main Game */}
          <Col id={`${game.mainGame}`}>
            <Row>
              <Col id={`${game.countdown}`}>
                <div id={`${game.header}`}>
                  <Countdown time={this.props.roomSettings.pairingTime/1000} before="The game starts in" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>Something</Col>
            </Row>
          </Col>

          {/* Matchup List */}
          <Col xs="3">
            <Card
              id={`${game.matchups}`}
              variant="dark"
              style={{ textAlign: "center" }}
            >
              <Card.Title>
                <strong>GET READY FOR YOUR MATCHUP</strong>
              </Card.Title>
              <div>{this.matchups}</div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
