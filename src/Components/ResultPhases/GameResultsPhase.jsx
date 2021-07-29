import React from "react";
import { Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class GameResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className={`${game.header}`}>That's all folks!</div>
        <div id={`${game.podium}`}>
          <Row>
            <Col>2nd</Col>
            <Col>1st</Col>
            <Col>3rd</Col>
          </Row>
        </div>
      </div>
    );
  }
}
