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
        <div className={`${game.header}`}>GGWP!</div>
        <div id={`${game.podium}`}>
          <div id={`${game.secondP}`}>
            <strong>2nd</strong>
            <div>linjerr492</div>
          </div>
          <div id={`${game.firstP}`}>
            <strong>1st</strong>
            <div>linrose362</div>
          </div>
          <div id={`${game.thirdP}`}>
            <strong>3rd</strong>
            <div>P.han.tom</div>
          </div>
        </div>

        <div id={game.rapperList}>
          <Row>
            <Col xs="8">4. linrose362</Col>
            <Col>100 points</Col>
          </Row>
          <Row>
            <Col xs="8">5. linjerr492</Col>
            <Col>75 points</Col>
          </Row>
          <Row>
            <Col xs="8">6. p.han.tom</Col>
            <Col>50 points</Col>
          </Row>
        </div>
      </div>
    );
  }
}
