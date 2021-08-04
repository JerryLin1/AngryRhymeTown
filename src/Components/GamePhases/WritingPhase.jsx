import React from "react";
import Countdown from "../Countdown.jsx";
import $ from "jquery";
import { Button, Col, Form, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class WritingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = {
      words: [],
      displayWords: [],
      nextWords: [true, false, false, false, false],
      currentLine: 0,
      potentialPoints: ["", "", "", ""],
      opponent: "",
    };

    this.socket.on("receiveWritingInfo", (newWords, opponent) => {
      this.setState({ words: newWords });
      this.setState({ opponent: opponent });
      let toDisplayWords = [];
      for (let i = 0; i < newWords.length; i++) {
        let display = "";
        for (let j = 0; j < newWords[i].length; j++) {
          let word = newWords[i][j];
          if (j === newWords[i].length - 1) {
            display += word.substring(0, 1).toUpperCase() + word.substring(1);
          } else {
            display +=
              word.substring(0, 1).toUpperCase() + word.substring(1) + " | ";
          }
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
    this.socket.emit("sendBars", $("#barInput_" + index).val());
  };

  finishedSpittin = () => {
    $(`#${game.finishWriting}`).attr("disabled", true);
    this.socket.emit("finishedSpittin");
  };

  displayBonuses = (index) => {
    let currentValue = $("#barInput_" + index)
      .val()
      .toLowerCase();
    let potential = 0;
    for (let word of this.state.words[index]) {
      if (currentValue.includes(word)) {
        potential += 50;
      }
    }
    potential = potential == 200 ? 300 : potential;

    let potentialPoints = [...this.state.potentialPoints];
    potentialPoints[index] = potential + " points from your words!";
    this.setState({ potentialPoints: potentialPoints });
  };

  generateInputFields = () => {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            this.showNextWords(i);
            this.sendBarsToServer(i);
            $(".btn-outline-dark:first").attr("class", "btn btn-success");
            this.setState({ currentLine: this.state.currentLine + 1 }, () => {
              $(`.${game.writingRow} input`)
                .eq(i + 1)
                .focus();
            });
          }}
          className={`${game.writingRow}`}
        >
          <Form.Group as={Row}>
            <Form.Label column xs="3">
              {this.displayWords(i)}
            </Form.Label>
            <Col xs="5">
              <Form.Control
                id={"barInput_" + i}
                autoComplete="off"
                disabled={this.state.currentLine !== i}
                onChange={() => {
                  this.displayBonuses(i);
                }}
                onBlur={() => {
                  let potentialPoints = [...this.state.potentialPoints];
                  potentialPoints[i] = "";
                  this.setState({ potentialPoints: potentialPoints });
                }}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-dark"
                disabled={this.state.currentLine !== i}
                type="submit"
              >
                Submit tha bar
              </Button>
            </Col>
            <Col xs="4">{this.state.potentialPoints[i]}</Col>
          </Form.Group>
        </Form>
      );
    }
    return arr;
  };

  render() {
    return (
      <div className="writingPhase">
        <Row>
          <Col>
            <div className={`${game.header}`}>Write your rhyme!</div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div
              style={{
                fontSize: "1.5em",
                textAlign: "center",
                marginBottom: "1em",
              }}
            >
              Your opponent is: {this.state.opponent}
            </div>
          </Col>
        </Row>

        <Row>
          <Countdown
            time={this.roomSettings.writingTime / 1000}
            before="You have "
            after=" to spit some bars!"
          />
        </Row>

        <div id={`${game.promptContainer}`}>{this.generateInputFields()}</div>

        <Row>
          <Col style={{ textAlign: "center" }}>
            <Button
              id={`${game.finishWriting}`}
              variant="outline-success"
              // disabled={this.state.currentLine !== 4}
              onClick={() => {
                $(`#${game.finishWriting}`).attr("class", "btn btn-success");
                this.finishedSpittin();
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
