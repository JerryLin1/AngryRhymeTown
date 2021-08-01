import React from "react";
import $ from "jquery";
import { Col, Row } from "react-bootstrap";
import game from "../Game.module.css";
import tts from "../../tts.js";

export default class RappingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;

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
      currentBattle: 0,
      matchup: [
        { nickname: "", bars: ["", "", "", ""] },
        { nickname: "", bars: ["", "", "", ""] },
      ],
      barDivs: [],
      pageBG: Math.floor(Math.random() * 4),
      ssu: tts.newSSU()
    };

    // TODO: socket.on for incoming matchup. readBars for both raps, with a delay in between.
    this.socket.on("receiveBattleRapping", matchup => {
      this.setState({ currentBattle: 0 });
      this.setState({ barDivs: [] });
      this.setState({ matchup: matchup });

      this.readBars();
    })

  }

  async readBars() {
    for (let bar of this.state.matchup[this.state.currentBattle].bars) {
      this.state.barDivs.push(<div>{bar}</div>);
      this.forceUpdate();
      if (!document.hidden) await tts.speak(this.state.ssu, bar);
    }

    if (this.state.currentBattle < 1) {
      this.setState({ currentBattle: this.state.currentBattle + 1 });
      this.setState({ barDivs: [] });
      this.readBars();
    } else {

      this.socket.emit("finishedListenin");

    }
    return;

  }

  render() {
    return (
      <div
        className={`${game.rapPhase}`}
        style={{
          background: `url(${this.state.backgroundImgs[this.state.pageBG]})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div
          className={`${game.header}`}
          style={{ backdropFilter: "blur(0.1em)" }}
        >
          Let's hear those bars from {this.state.matchup[this.state.currentBattle].nickname}!
        </div>
        <br />
        <Row>
          <Col xs={{ offset: 4, span: 4 }} id={`${game.rapDisplay}`}>
            {this.state.barDivs}
          </Col>
        </Row>
      </div>
    );
  }
}
