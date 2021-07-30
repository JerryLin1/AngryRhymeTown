import React from "react";
import { Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class RappingPhase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundImgs: [
        "https://mediacloud.kiplinger.com/image/private/s--o_dOiB7J--/v1599666964/Investing/small-town-millionaires-2020.jpg",
      ],
    };
  }

  // It's supposed to play each rap and switch after the tts is over but idk how to figure out when tts is over
  render() {
    return (
      <div
        className={`${game.rapPhase}`}
        style={{
          background: `url('${
            this.state.backgroundImgs[Math.floor(Math.random())]
          }')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div
          className={`${game.header}`}
          style={{backdropFilter: "blur(0.1em)"}}
        >
          Let's hear those bars!
        </div>
        <br />
        <Row>
          <Col xs={{ offset: 4, span: 4 }} id={`${game.rapDisplay}`}>
            <div>Hey my name is Jerry Lin</div>
            <div>Everyday I only win</div>
            <div>Every time I get that dub</div>
            <div>I take a bath inside my tub</div>
          </Col>
        </Row>
      </div>
    );
  }
}
