import React from "react";
import { Row, Col } from "react-bootstrap";
import { Award } from "react-bootstrap-icons";
import game from "../Game.module.css";

export default class RoundResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={`${game.header}`}>
          Here are the results for round {"**round number**"}!
        </div>

        <br />

        <div id={`${game.rapperList}`}>
          <Row>
            <Col xs="8">
              1. linrose362 <Award style={{ color: "#d4af37" }} />
            </Col>
            <Col>100 points</Col>
          </Row>
          <Row>
            <Col xs="8">
              2. linjerr492 <Award style={{ color: "#C0C0C0" }} />
            </Col>
            <Col>75 points</Col>
          </Row>
          <Row>
            <Col xs="8">
              3. p.han.tom <Award style={{ color: "#cd7f32 " }} />
            </Col>

            <Col>50 points</Col>
          </Row>
        </div>
      </div>
    );
  }
}
