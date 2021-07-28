import React from "react";
import Countdown from "../Countdown.jsx";
import { Button, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";

export default class VotingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchup: [
        { nickname: "Loading", bars: "Loading" },
        { nickname: "Loading", bars: "Loading" },
      ],
    };

    this.props.socket.on("receiveBattle", (battle) => {
      if (battle === "finished") {
        // handle here
      } else {
        this.setState({ matchup: battle });
        console.log(this.state.matchup);
      }
    });
  }

  componentDidMount() {
    this.getNextBattle();
  }

  getNextBattle = () => {
    this.props.socket.emit("getBattle");
  };

  vote = (rapper) => {
    this.props.socket.emit("receiveVote", rapper);
  };

  render() {
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

    return (
      <div className={`${game.votePhase}`}>
        <Row>
          <div className={`${game.header}`}>Time To Vote!</div>
        </Row>
        <Row>
          <Countdown
            time={this.props.roomSettings.votingTime / 1000}
            before="You have"
            after="left to vote for your favorite rap!"
          />
        </Row>

        <Row>
          <Col xs="5" sm={{ offset: 2 }} style={{ color: fontColors[color1] }}>
            <div className={`${game.rapperName}`}>
              {this.state.matchup[0].nickname}
            </div>
            <div className={`${game.rap}`}>{this.state.matchup[0].bars}</div>
          </Col>

          <Col xs="5" style={{ color: fontColors[color2] }}>
            <div className={`${game.rapperName}`}>
              {this.state.matchup[1].nickname}
            </div>
            <div className={`${game.rap}`}>{this.state.matchup[1].bars}</div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="3" sm={{ offset: 2 }}>
            <Button
              variant="outline-success"
              style={{ justifyContent: "center" }}
              onClick={() => {
                this.vote(1);
              }}
            >
              Vote for {this.state.matchup[0].nickname}'s rap!
            </Button>
          </Col>
          <Col xs="3" sm={{ offset: 2 }}>
            <Button
              variant="outline-success"
              style={{ justifyContent: "center" }}
              onClick={() => {
                this.vote(2);
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
