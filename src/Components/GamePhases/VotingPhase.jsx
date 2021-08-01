import React from "react";
import Countdown from "../Countdown.jsx";
import { Button, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class VotingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;
    this.restartTimer = 0;

    const fontColors = [
      "rgb(0, 119, 255)",
      "rgb(0, 192, 26)",
      "rgb(255, 129, 11)",
      "rgb(228, 0, 209)",
      "rgb(0, 228, 179)",
    ];
    // this portion generates 2 colors that are guarenteed to be different from each other
    let color1 = Math.floor(Math.random() * 5),
      color2 = Math.floor(Math.random() * 5);

    while (color1 === color2) {
      color2 = Math.floor(Math.random() * 5);
    }

    this.state = {
      matchup: [
        {
          nickname: "Loading",
          bars: ["Loading", "Loading", "Loading", "Loading"],
        },
        {
          nickname: "Loading",
          bars: ["Loading", "Loading", "Loading", "Loading"],
        },
      ],
      voted: false,
      color1: fontColors[color1],
      color2: fontColors[color2],
      countdown: (
        <Countdown
          key={this.restartTimer}
          time={this.roomSettings.votingTime / 1000}
          before="You have"
          after="left to vote for your favorite rap!"
        />
      ),
    };

    this.socket.on("receiveBattleVoting", (battle) => {
      this.setState({ matchup: battle });
      this.setState({
        voted:
          this.client.name === battle[0].nickname ||
          this.client.name === battle[1].nickname,
      });
      this.restartTimer++;
      this.forceUpdate();
    });
  }

  vote = (rapper) => {
    this.socket.emit("receiveVote", rapper);
  };

  renderBars = (matchup) => {
    return this.state.matchup[matchup].bars.map((bar, key) => {
      return <div key={key}>{bar}</div>;
    });
  };

  render() {
    const color1 = this.state.color1;
    const color2 = this.state.color2;

    return (
      <div className={`${game.votePhase}`}>
        <Row>
          <div className={`${game.header}`}>Time To Vote!</div>
        </Row>
        <Row>{this.state.countdown}</Row>

        <Row>
          <Col xs="5" sm={{ offset: 2 }} style={{ color: color1 }}>
            <div className={`${game.rapperName}`}>
              {this.state.matchup[0].nickname}
            </div>
            <div className={`${game.rap}`}>{this.renderBars(0)}</div>
          </Col>

          <Col xs="5" style={{ color: color2 }}>
            <div className={`${game.rapperName}`}>
              {this.state.matchup[1].nickname}
            </div>
            <div className={`${game.rap}`}>{this.renderBars(1)}</div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="3" sm={{ offset: 2 }}>
            <Button
              variant="outline-light"
              style={{
                color: color1,
                border: `1px solid ${color1}`,
              }}
              disabled={this.state.voted}
              onClick={() => {
                this.vote(1);
                this.setState({ voted: true });
              }}
            >
              Vote for {this.state.matchup[0].nickname}'s rap!
            </Button>
          </Col>
          <Col xs="3" sm={{ offset: 2 }}>
            <Button
              variant="outline-light"
              style={{
                color: color2,
                border: `1px solid ${color2}`,
              }}
              disabled={this.state.voted}
              onClick={() => {
                this.vote(2);
                this.setState({ voted: true });
              }}
            >
              Vote for {this.state.matchup[1].nickname}'s rap!
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
