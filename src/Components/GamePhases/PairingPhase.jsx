import React from "react";
import Countdown from "../Countdown.jsx";
import { Card, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class PairingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = {opponent: ""}

    this.state = { matchups: [] };
    this.socket.on("sendPairings", (pairDisplay) => {
      let matchups = [];
      for (let pair of pairDisplay) {
        // bold the current player's matchup
        if (
          (this.client.name === "" &&
            (pair[0] ===
              `Player #${this.socket.id.substring(0, 4).toUpperCase()}` ||
              pair[1] ===
                `Player #${this.socket.id.substring(0, 4).toUpperCase()}`)) ||
          this.client.name === pair[0] ||
          this.client.name === pair[1]
        ) {
          matchups.push(
            <Card.Body>
              <strong>{`${pair[0]} vs. ${pair[1]}`}</strong>
            </Card.Body>
          );
        } else {
          matchups.push(<Card.Body>{`${pair[0]} vs. ${pair[1]}`}</Card.Body>);
        }
      }
      this.setState({ matchups: matchups });
    });

    this.socket.on("sendOpponent", opponent => {
      this.setState({opponent: opponent});
    }) 
  }

  render() {
    console.log(this.socket.id);
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
                <Card.Title>Your opponent is: {this.state.opponent}!</Card.Title>
                <Card.Text>Think you can beat them? (in game ofc.)</Card.Text>
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
