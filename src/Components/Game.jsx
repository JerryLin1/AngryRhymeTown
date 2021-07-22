import React from "react";
import $ from "jquery"
import Countdown from "./Countdown.jsx";
import { Card, Col, Row } from "react-bootstrap";
import game from "./Game.module.css";

class PairingPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.startPhase(this.props.nextPhase, 5);
  }

  render() {

    return (
      <div>
        <Row>
          {/* Main Game */}
          <Col id={`${game.mainGame}`}>
            <Row>
              <Col id={`${game.countdown}`}>
                <Countdown time={5} />
              </Col>
            </Row>
            <Row>
              <Col>{this.props.words}</Col>
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
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

class WritingPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.startPhase(this.props.nextPhase, 5);
  }

  render() {
    return (
      <div>
        <div>Writing Phase</div>
        <Countdown time={5} />
      </div>
    );
  }
}

class VotingPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.startPhase(this.props.nextPhase, 5);
  }

  render() {
    return (
      <div>
        <div></div>
      </div>
    );
  }
}

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
      return <PairingPhase/>
    } else if (this.state.phase === "Writing") {
      return <WritingPhase/>
    } else if (this.state.phase == "Voting") {
      return <VotingPhase />
    }
  }

  ////////////////// REMEMBER TO CHANGE INDEX.JS BACK //////////////////
  render() {
    return <div className="game">{this.setPhase()}</div>;
  }
}
