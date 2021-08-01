import React from "react";
import { Col, Row } from "react-bootstrap";
import tts from "../../tts";
import game from "../Game.module.css";

export default class RappingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;

    this.state = {
      backgroundImgs: [
        "https://mediacloud.kiplinger.com/image/private/s--o_dOiB7J--/v1599666964/Investing/small-town-millionaires-2020.jpg",
      ],
      currentBattle: 0,
      matchup: [
        { nickname: "", bars: ["", "", "", ""] },
        { nickname: "", bars: ["", "", "", ""] },
      ],
      barDivs: [],
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
      if (!document.hidden)
        await tts.speak(this.state.ssu, bar);
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
          background: `url('${this.state.backgroundImgs[Math.floor(Math.random())]
            }')`,
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
