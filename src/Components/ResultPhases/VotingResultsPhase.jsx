import React from "react";
import game from "../Game.module.css";
import { Col, Row } from "react-bootstrap";

export default class VotingResultsPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={`${game.header}`}>The results are in!</div>
        <br />
        <Row>
          <Col style={{ textAlign: "center" }}>
            <div className={`${game.rapperName}`}>{"RAPPER 1"}</div>
            <div className={`${game.voters}`}>
              <div>VOTER 1</div>
              <div>VOTER 3</div>
            </div>
            <div>Total Votes: {"TOTAL VOTES"}</div>
          </Col>
          <Col style={{ textAlign: "center" }}>
            <div className={`${game.rapperName}`}>{"RAPPER 2"}</div>
            <div className={`${game.voters}`}>
              {/* Render the voters using map the map method or something and they will automatically be formatted */}
              <div>VOTER 2</div>
              <div>VOTER 4</div>
            </div>

            <div>Total Votes: {"TOTAL VOTES"}</div>
          </Col>
        </Row>
      </div>
    );
  }
}
