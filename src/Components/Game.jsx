import React from "react";
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
          <Col>
            <h1>GAME :D</h1>
            <Countdown time={5} />

          </Col>

          {/* Matchup List */}
          <Col xs="2">
            <Card variant="dark">
              <Card.Title>GET READY</Card.Title>
              <Card.Body>I dont know how to do this</Card.Body>
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
        <div>writing phase</div>
        <Countdown time={5} />

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
  }

  setPhase = () => {
    if (this.state.phase === "Pairing") {
      return <PairingPhase
        startPhase={this.client.startPhase}
        nextPhase="Writing" />
    } else if (this.state.phase === "Writing") {
      return <WritingPhase
        startPhase={this.client.startPhase}
        nextPhase="Pairing" />
    }
    /// add more phases
  }

  ////////////////// REMEMBER TO CHANGE INDEX.JS BACK //////////////////
  render() {
    return (
      <div className="game">
        {this.setPhase()}
      </div>
    );
  }
}