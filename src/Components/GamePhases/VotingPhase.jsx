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
      voted: false
    };

    this.props.socket.on("receiveBattle", (battle) => {
      if (battle === "finished") {
        console.log(battle);
        // handle here
      } else {
        this.setState({ matchup: battle });
        this.setState({voted: false});
        console.log(this.state.matchup);
      }
    });
  }

  vote = (rapper) => {
    this.props.socket.emit("receiveVote", rapper);
  };

  render() {
    return (
      <div>
        <Row>
          <div id={`${game.header}`}>Time To Vote!</div>
        </Row>
        <Row>
          <Countdown
            time={this.props.roomSettings.votingTime/1000}
            before="You have"
            after="left to vote for your favorite rap!"
          />
        </Row>

        <Row>
          <Col xs="5" sm={{ offset: 2 }}>
            {this.state.matchup[0].nickname}
            <div>{this.state.matchup[0].bars}</div>
          </Col>

          <Col xs="5">
            {this.state.matchup[1].nickname}
            <div>{this.state.matchup[1].bars}</div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="3" sm={{ offset: 2 }}>
            <Button
              variant="outline-success"
              style={{ justifyContent: "center" }}
              disabled = {this.state.voted}
              onClick={() => {
                this.vote(1);
                this.setState({voted: true});

              }}
            >
              Vote for {this.state.matchup[0].nickname}'s rap!
            </Button>
          </Col>
          <Col xs="3" sm={{ offset: 2 }}>
            <Button
              variant="outline-success"
              style={{ justifyContent: "center" }}
              disabled = {this.state.voted}
              onClick={() => {
                this.vote(2);
                this.setState({voted: true});
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
