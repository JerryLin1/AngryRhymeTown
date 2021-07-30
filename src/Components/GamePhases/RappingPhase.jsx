import React from "react";
import { Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class RappingPhase extends React.Component {
  constructor(props) {
    super(props);
  }

  // It's supposed to play each rap and switch after the tts is over but idk how to figure out when tts is over
  render() {
    return (
      <div>
        <div className={`${game.header}`}>Let's hear those bars!</div>
        <Row>
          <Col id={`${game.rapDisplay}`}>Some racist/homophobic rap</Col>
          <Col>
            <img
              src="https://apklatestversion.com/logo/friday-night-funkin-wiki-apk.jpg"
              alt="rapper"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
