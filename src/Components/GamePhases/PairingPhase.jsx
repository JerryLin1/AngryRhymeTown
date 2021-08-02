import React from "react";
import Countdown from "../Countdown.jsx";
import { Card, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";
import { CardChecklist } from "react-bootstrap-icons";

export default class PairingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = { matchups: [] };
    this.socket.on("sendPairings", (pairDisplay) => {
      let matchups = [];
      for (let pair of pairDisplay) {
        matchups.push(<Card.Body>{`${pair[0]} vs. ${pair[1]}`}</Card.Body>);
      }
      this.setState({ matchups: matchups });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <Row>
              <Col id={`${game.countdown}`}>
                <div className={`${game.header}`}>
                  <Countdown
                    time={this.roomSettings.pairingTime / 1000}
                    before="The game starts in"
                  />
                </div>
              </Col>
            </Row>
            <Row id={`${game.opponentCardRow}`}>
              <Card id={`${game.opponentCard}`} className="text-center">
                <Card.Title>Your opponent is: **name**!</Card.Title>
                <Card.Text>Think you can beat them? (in game)</Card.Text>
                <Card.Img
                  id={`${game.opponentCard}`}
                  src="https://i.redd.it/5andi3picpy61.jpg"
                  alt="opponent icon"
                />
              </Card>
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
                <strong>GET READY FOR YOUR MATCHUP!</strong>
              </Card.Title>
              <div>{this.state.matchups}</div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
