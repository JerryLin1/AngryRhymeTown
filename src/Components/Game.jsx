import React from "react";
import $ from "jquery";
import Countdown from "./Countdown.jsx";
import anime from "animejs";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import game from "./Game.module.css";

// ANCHOR: Pairing Phase
class PairingPhase extends React.Component {
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

// ANCHOR: Writing Phase
class WritingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      displayWords: [],
      nextWords: [true, false, false, false, false],
      currentLine: 0,
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
    this.props.socket.emit("sendBars", $("#barInput_" + index).val());
  };

  generateInputFields = () => {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(
        <Form.Group as={Row}>
          <Form.Label column xs="3">
            {this.displayWords(i)}
          </Form.Label>
          <Col xs="5">
            <Form.Control id={"barInput_" + i} autoComplete="off" />
          </Col>
          <Col xs="4">
            <Button
              variant="outline-dark"
              disabled={this.state.currentLine !== i}
              onClick={() => {
                this.showNextWords(i);
                this.sendBarsToServer(i);
                $(".btn-outline-dark:first").attr("class", "btn btn-success");
                this.setState({ currentLine: this.state.currentLine + 1 });
              }}
            >
              Submit tha bar
            </Button>
          </Col>
        </Form.Group>
      );
    }
    return arr;
  };

  render() {
    return (
      <div className="writingPhase">
        <Row>
          <Col>
            <div id={`${game.header}`}>Write your rhyme!</div>
          </Col>
        </Row>

        <Row id="countdown">
          <Countdown time={10} />
        </Row>

        <div id={`${game.promptContainer}`}>{this.generateInputFields()}</div>

        <Row>
          <Col style={{ textAlign: "center" }}>
            <Button
              id={`${game.finishWriting}`}
              variant="danger"
              onMouseOver={() => {
                anime({
                  targets: `#${game.finishWriting}`,
                  backgroundColor: "#fff",
                  border: "1px solid #198754",
                  color: "#198754",
                  duration: 150,
                });
              }}
              onMouseOut={() => {
                if ($(`#${game.finishWriting}`).css("background-color") === "rgb(25, 135, 84)") {
                  return;
                }
                anime({
                  targets: `#${game.finishWriting}`,
                  backgroundColor: "#dc3545",
                  border: "1px solid #dc3545",
                  color: "#fff",
                  duration: 150,
                });
              }}
              onClick={() => {
                anime({
                  targets: `#${game.finishWriting}`,
                  backgroundColor: "#198754",
                  border: "1px solid #198754",
                  color: "#fff",
                  duration: 150,
                });
              }}
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
    this.state = {
      matchup: [
        { nickname: "Loading", bars: "Loading" },
        { nickname: "Loading", bars: "Loading" },
      ],
    };

    this.props.socket.on("receiveBattle", (battle) => {
      if (battle === "finished") {
        // handle here
      } else {
        this.setState({ matchup: battle });
        console.log(this.state.matchup);
      }
    });
  }

  componentDidMount() {
    this.getNextBattle();
  }

  getNextBattle = () => {
    this.props.socket.emit("getBattle");
  };

  vote = (rapper) => {
    this.props.socket.emit("receiveVote", rapper);
  };

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
          <Col xs="5" sm={{ offset: 2 }}>
            {this.state.matchup[0].nickname}
            <div>{this.state.matchup[0].bars}</div>
          </Col>

          <Col xs="5">
            {this.state.matchup[1].nickname}
            <div>{this.state.matchup[1].bars}</div>
          </Col>
        </Row>

        <Row>
          <Col xs="3" sm={{ offset: 4 }}>
            <Button
              style={{ justifyContent: "center" }}
              onClick={() => {
                this.vote(1);
              }}
            >
              Vote for {this.state.matchup[0].nickname}'s rap!
            </Button>
          </Col>
          <Col xs="3">
            <Button
              style={{ justifyContent: "center" }}
              onClick={() => {
                this.vote(2);
              }}
            >
              Vote for {this.state.matchup[1].nickname}'s rap!
            </Button>
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
    this.state = { phase: "Pairing" };
    this.switchPhase = this.switchPhase.bind(this);
    this.client.switchPhase = this.switchPhase;
  }

  switchPhase = (newPhase) => {
    this.setState({ phase: newPhase });
  };

  setPhase = () => {
    // if (this.state.phase === "Pairing") {
    //   return <PairingPhase socket={this.client.socket} />;
    // } else if (this.state.phase === "Writing") {
    return <WritingPhase socket={this.client.socket} />;
    // } else if (this.state.phase === "Voting") {
    //   return <VotingPhase socket={this.client.socket} />;
    // } else if (this.state.phase == "VotingResults") {
    //   return <VotingResultsPhase />;
    // } else if (this.state.phase == "RoundResults") {
    //   return <RoundResultsPhase />;
    // } else if (this.state.phase == "GameResults") {
    //   return <GameResultsPhase />;
    // }
  };

  ////////////////// REMEMBER TO CHANGE INDEX.JS BACK //////////////////
  render() {
    return <div className="game">{this.setPhase()}</div>;
  }
}
