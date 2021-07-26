import React from "react";
import Countdown from "../Countdown.jsx";
import anime from "animejs";
import $ from "jquery";
import { Button, Col, Form, Row } from "react-bootstrap";
import game from "../Game.module.css";


export default class WritingPhase extends React.Component {
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
              <Form.Control
                id={"barInput_" + i}
                autoComplete="off"
                disabled={this.state.currentLine !== i}
              />
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
                variant="outline-success"
                onClick={() => {
                  $(`#${game.finishWriting}`).attr("class", "btn btn-success");
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