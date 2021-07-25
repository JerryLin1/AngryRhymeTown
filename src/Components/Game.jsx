import React from "react";
import $ from "jquery";
import Countdown from "./Countdown.jsx";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import game from "./Game.module.css";

class PairingPhase extends React.Component {
  matchups = [];
  constructor(props) {
    super(props);
    this.props.socket.on("startPairPhase", (pairs) => {
      for (let pair of Object.entries(pairs)) {
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
              <div>{this.matchups}</div>
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
    this.state = {
      words: [],
      displayWords: [],
      nextWords: [true, false, false, false, false],
    };

    this.props.socket.on("receiveWords", (newWords) => {
      this.setState({ words: newWords });

      let toDisplayWords = [];
      for (let i = 0; i < newWords.length; i++) {
        let display = "";
        for (let word of newWords[i]) {
          display +=
            word.substring(0, 1).toUpperCase() + word.substring(1) + " / ";
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
  };

  displayWords = (index) => {
    if (this.state.nextWords[index]) {
      return this.state.displayWords[index];
    }
  };

  sendBarsToServer = (index) => {
    this.props.socket.emit(
      "sendBars",
      $("#barInput_" + index).val()
    );
  }

  generateInputFields = () => {
    let arr = []
    for (let i = 0; i < 4; i++) {
      arr.push(
        <Form.Group as={Row}>
          <Form.Label column xs="3">
            {this.displayWords(i)}
          </Form.Label>
          <Col xs="5">
            <Form.Control id={"barInput_" + i} />
          </Col>
          <Col xs="4">
            <Button
              variant="outline-dark"
              disabled={this.state.nextWords[i + 1]}
              onClick={() => {
                this.showNextWords(i);
                this.sendBarsToServer(i);
              }}
            >
              Submit tha bar
            </Button>
          </Col>
        </Form.Group>
      )
    }
    return arr;
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
          {this.generateInputFields()}
        </div>

        <Row>
          <Col>
            <Button
              variant="outline-dark"

            >
              Finish Spitting
            </Button>
          </Col>

        </Row>
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
            <Button variant="outline-success">VOTE</Button>
          </Col>
          <Col xs="3">
            <Button variant="outline-success">VOTE</Button>
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
    return <div>da voting results</div>;
  }
}
class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>da round results</div>;
  }
}
class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>da game results</div>;
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
      return <PairingPhase socket={this.client.socket} />;
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
