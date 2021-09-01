import React from "react";
import Countdown from "../Countdown.jsx";
import $ from "jquery";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import sounds from "../../sounds.js";
import game from "../Game.module.css";
import sound from "../../assets/select.mp3";
import anime from "animejs";

export default class WritingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = {
      words: [],
      displayWords: [],
      currentLine: 0,
      wordsForCurrentBar: "",
      potentialPoints: [
        "0 bonus points from your word(s)!",
        "0 bonus points from your word(s)!",
        "0 bonus points from your word(s)!",
        "0 bonus points from your word(s)!",
      ],
      opponent: "",
    };

    this.socket.emit("receiveWritingInfo", (writingInfo) => {
      this.setState({ words: writingInfo.newWords });
      this.setState({ opponent: writingInfo.opponent });
      let toDisplayWords = [];
      for (let i = 0; i < this.state.words.length; i++) {
        let display = [];
        for (let j = 0; j < this.state.words[i].length; j++) {
          let word = this.state.words[i][j];
          display.push(
            <div className={`${game.displayWords}`}>
              {j + 1}. {word.substring(0, 1).toUpperCase()}
              {word.substring(1)}
            </div>
          );
        }
        toDisplayWords.push(display);
      }
      this.setState({ displayWords: toDisplayWords });
      this.setState({ wordsForCurrentBar: toDisplayWords[0] });
    });
  }

  sendBarsToServer = (index) => {
    this.socket.emit("sendBars", $(`#barInput_${index}`).val());
  };

  finishedSpittin = () => {
    $(`#${game.finishWriting}`).attr("disabled", true);
    this.socket.emit("finishedSpittin");
  };

  displayBonuses = (index) => {
    let currentValue = $(`#barInput_${index}`).val().toLowerCase();
    let potential = 0;

    for (let i = 0; i < this.state.words[index].length; i++) {
      const word = this.state.words[index][i];
      if (currentValue.includes(word)) {
        potential += 50;

        // highlight the word that they have used in their rap
        $(`#${game.displayWordsWrapper}`)
          .find(".card")
          .find(".card-body")
          .find("div")
          .eq(i)
          .css("border", "solid #e8ff52 3px");

        $(`#${game.displayWordsWrapper}`)
          .find(".card")
          .find(".card-body")
          .find("div")
          .eq(i)
          .css({ boxShadow: "0 0 10px #f2ff8e", backgroundColor: "#fff" });
      } else {
        $(`#${game.displayWordsWrapper}`)
          .find(".card")
          .find(".card-body")
          .find("div")
          .eq(i)
          .css("border", "none");

        $(`#${game.displayWordsWrapper}`)
          .find(".card")
          .find(".card-body")
          .find("div")
          .eq(i)
          .css("boxShadow", "none");
      }
    }

    potential = potential == 200 ? 300 : potential;

    let potentialPoints = [...this.state.potentialPoints];
    potentialPoints[index] = potential + " bonus points from your word(s)!";
    this.setState({ potentialPoints: potentialPoints });
  };

  generateInputFields = () => {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(
        <Form
          onSubmit={(e) => {
            e.preventDefault();

            sounds.play("button");
            this.sendBarsToServer(i);
            $(".btn-outline-dark:first").attr("class", "btn btn-success");

            this.setState({ currentLine: this.state.currentLine + 1 }, () => {
              $(`.${game.writingRow} input`)
                .eq(i + 1)
                .focus();
            });
            this.setState({
              wordsForCurrentBar: this.state.displayWords[i + 1],
            });
            if (i < 3) this.displayBonuses(i + 1);
          }}
          className={`${game.writingRow}`}
        >
          <Form.Group as={Row}>
            <Col xs="9">
              <Form.Control
                className={`${game.barInputs}`}
                placeholder={"Write bar #" + (i + 1) + " here..."}
                id={`barInput_${i}`}
                autoComplete="off"
                disabled={this.state.currentLine !== i}
                onChange={() => {
                  this.displayBonuses(i);
                }}
              />
            </Col>
            <Col xs="3">
              <Button
                variant="outline-dark"
                disabled={this.state.currentLine !== i}
                type="submit"
              >
                Submit the bar
              </Button>
            </Col>
          </Form.Group>
        </Form>
      );
    }
    return arr;
  };

  render() {
    return (
      <div className={`${game.writingPhase}`}>
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
              Your opponent is: <strong>{this.state.opponent}</strong>
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

        <Row id={`${game.promptContainer}`}>
          <Col xs="4" id={`${game.displayWordsWrapper}`}>
            <Card className={`${game.writingPhaseCards}`}>
              <Card.Header className={`${game.writingPhaseHeaders}`}>
                {this.state.currentLine < 4
                  ? "Your power words for bar #" + (this.state.currentLine + 1)
                  : "Press finished spittin!"}
              </Card.Header>
              <Card.Body style={{ color: "#245497" }}>
                <h5>{this.state.potentialPoints[this.state.currentLine]}</h5>
                {this.state.wordsForCurrentBar}
              </Card.Body>
            </Card>
          </Col>
          <Col id={`${game.barInputWrapper}`}>
            <Card className={`${game.writingPhaseCards}`}>
              <Card.Header className={`${game.writingPhaseHeaders}`}>
                Write your bars here
              </Card.Header>
              <Card.Body style={{ color: "#245497" }}>
                {this.generateInputFields()}
                <Button
                  id={`${game.finishWriting}`}
                  variant="outline-success"
                  onClick={() => {
                    sounds.play("button");
                    $(`#${game.finishWriting}`).attr(
                      "class",
                      "btn btn-success"
                    );
                    this.finishedSpittin();
                  }}
                >
                  Finish Spitting
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
