import React from "react";
import { Row, Col } from "react-bootstrap";
import game from "../Game.module.css";

export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className={`${game.header}`}>
          Here are the results for round {"ROUND"}!
        </div>
        
        <br />

        <div id={`${game.rapperList}`}>
          <Row>
            <Col xs={{ offset: 1, span: 8 }}>1. linrose362</Col>
            <Col>100 points</Col>
          </Row>
          <Row>
            <Col xs={{ offset: 1, span: 8 }}>2. linjerr492</Col>
            <Col>75 points</Col>
          </Row>
          <Row>
            <Col xs={{ offset: 1, span: 8 }}>3. p.han.tom</Col>
            <Col>50 points</Col>
          </Row>
        </div>
      </div>
    );
  }
}
