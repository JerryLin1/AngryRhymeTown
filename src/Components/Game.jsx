import React from "react";
import $ from "jquery";
import Countdown from "./Countdown.jsx";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import game from "./Game.module.css";

class PairingPhase extends React.Component {
  constructor(props) {
    super(props);
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
                  The game starts in <Countdown time={5} /> seconds
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
              <Card.Body>A vs B</Card.Body>
              <Card.Body>C vs D</Card.Body>
              <Card.Body>E vs F</Card.Body>
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
    this.state = { words: [], displayWords: [], nextWords: [true, false, false, false] };

    this.props.socket.on("receiveWords", (newWords) => {
      this.setState({ words: newWords });

      let toDisplayWords = [];
      for (let i = 0; i < newWords.length; i++) {
        let display = "";
        for (let word of newWords[i]) {
          display += word.substring(0, 1).toUpperCase() + word.substring(1) + " / ";
        }
        toDisplayWords.push(display);
      }
      this.setState({ displayWords: toDisplayWords });
    });
  }

  showNextWords = (barIndex) => {
    let updateNextWords = this.state.nextWords;
    updateNextWords[barIndex + 1] = true;
    this.setState({ nextWords: updateNextWords });
  }

  displayWords = (index) => {
    if (this.state.nextWords[index]) {
      return this.state.displayWords[index];
    }
  }

  render() {
    return (
      <div className="writingPhase">
        <Row>
          <Col>
            <div id={`${game.header}`}>Write your rhyme!</div>
          </Col>
        </Row>

        <Row id="countdown">
          <Countdown time={5} />
        </Row>

        <div id={`${game.promptContainer}`}>
          <Form.Group as={Row}>
            <Form.Label column xs="3">
              {this.displayWords(0)}
            </Form.Label>
            <Col xs="5">
              <Form.Control id={`${game.word_1}`} />
            </Col>
            <Col xs="4">
              <Button
                variant="outline-dark"
                onClick={() => {
                  this.showNextWords(0);
                  this.props.socket.emit("sendBars", $(`#${game.word_1}`).val());
                }}>
                Submit tha bar
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column xs="3">
              {this.displayWords(1)}
            </Form.Label>
            <Col xs="5">
              <Form.Control id={game.word_2} />
            </Col>
            <Col xs="4">
              <Button
                variant="outline-dark"
                onClick={() => { this.showNextWords(1) }}>
                Submit tha bar
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column xs="3">
              {this.displayWords(2)}
            </Form.Label>
            <Col xs="5">
              <Form.Control id={game.word_3} />
            </Col>
            <Col xs="4">
              <Button
                variant="outline-dark"
                onClick={() => { this.showNextWords(2) }}>
                Submit tha bar
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column xs="3">
              {this.displayWords(3)}
            </Form.Label>
            <Col xs="5">
              <Form.Control id={game.word_4} />
            </Col>
            <Col xs="4">
              <Button
                variant="outline-dark"
                onClick={() => { }}>
                Submit tha bar
              </Button>
            </Col>
          </Form.Group>
        </div>
      </div>
    );
  }
}

class VotingPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row>
          <div id={`${game.header}`}>Time To Vote!</div>
        </Row>
        <Row>
          <div className={`${game.timePrompt}`}>
            You have <Countdown time={5} /> seconds left to vote for your
            favorite rap!
          </div>
        </Row>

        <Row>
          <Col xs="3" sm={{ offset: 4 }}>
            Gerry Lin's Rap
          </Col>
          <Col xs="3">P.han.tom's Rap</Col>
        </Row>

        <Row>
          <Col xs="3" sm={{ offset: 4 }}>
            <Button style={{ justifyContent: "center" }}>lol</Button>
          </Col>
          <Col xs="3">
            <Button style={{ justifyContent: "center" }}>lol</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

class VotingResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        da voting results
      </div>
    )
  }
}
class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        da round results
      </div>
    )
  }
}
class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        da game results
      </div>
    )
  }
}
export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.state = { phase: "Pairing", words: [] };
    this.switchPhase = this.switchPhase.bind(this);
    this.client.switchPhase = this.switchPhase;
  }

  switchPhase = (newPhase) => {
    this.setState({ phase: newPhase });
  };

  setPhase = () => {
    if (this.state.phase === "Pairing") {
      return <PairingPhase />;
    } else if (this.state.phase === "Writing") {
      return <WritingPhase socket={this.client.socket} />;
    } else if (this.state.phase === "Voting") {
      return <VotingPhase />;
    } else if (this.state.phase == "VotingResults") {
      return <VotingResultsPhase />;
    } else if (this.state.phase == "RoundResults") {
      return <RoundResultsPhase />;
    } else if (this.state.phase == "GameResults") {
      return <GameResultsPhase />;
    }
  };

  ////////////////// REMEMBER TO CHANGE INDEX.JS BACK //////////////////
  render() {
    return <div className="game">{this.setPhase()}</div>;
  }
}
