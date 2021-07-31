import React from "react";
import { Col, Row } from "react-bootstrap";
import $ from "jquery";
import game from "../Game.module.css";
import tts from "../../tts.js";

export default class RappingPhase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundImgs: [
        "https://mediacloud.kiplinger.com/image/private/s--o_dOiB7J--/v1599666964/Investing/small-town-millionaires-2020.jpg",
        "https://static.onecms.io/wp-content/uploads/sites/24/2021/02/22/2432703_WhyIm_114w-2000.jpg",
        "https://cdn.theculturetrip.com/wp-content/uploads/2017/11/paris-ontatio-courtesy-of-county-of-brant.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/f/fa/Lemgo_-_Marktplatz_mit_Rathaus.jpg",
      ],
      bars: [
        "Hey my name is Jerry Lin",
        "Everyday I only win",
        "Every time I get that dub",
        "I take a bath inside my tub",
      ],
    };
  }

  displayBarLine(line) {
    $(`#${game.rapDisplay}>div`).eq(line).style("display", "block");
  }

  displayPlayerBars = (player) => {
    // let promise = tts.speak(this.state.bars[0]);
    // for (let i = 1; i < 4; i++) {
    //   promise.then(() => {
    //     tts.speak(this.state.bars[i]);
    //   });
    // }

    // promise.catch((err) => {
    //   console.log(err);
    // });

    return this.state.bars.map((bar, key) => {
      return (
        <div key={key} style={{ display: "none" }}>
          {bar}
        </div>
      );
    });
  };

  // It's supposed to play each rap and switch after the tts is over but idk how to figure out when tts is over
  render() {
    const background = this.state.backgroundImgs[Math.floor(Math.random() * 4)];
    return (
      <div
        className={`${game.rapPhase}`}
        style={{
          background: `url(${background})`,
        }}
      >
        <div
          className={`${game.header}`}
          style={{ backdropFilter: "blur(0.1em)" }}
        >
          Let's hear those bars!
        </div>
        <br />
        <Row>
          <Col xs={{ offset: 4, span: 4 }} id={`${game.rapDisplay}`}>
            {this.displayPlayerBars(0)}
          </Col>
        </Row>
      </div>
    );
  }
}
