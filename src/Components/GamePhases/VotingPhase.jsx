
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
      return (
        <div>
          <Row>
            <div id={`${game.header}`}>Time To Vote!</div>
          </Row>
          <Row>
            <div className={`${game.timePrompt}`}>
              You have <Countdown time={5} /> seconds left to vote for your
              favorite rap!
            </div>
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
  
          <Row>
            <Col xs="3" sm={{ offset: 4 }}>
              <Button
                style={{ justifyContent: "center" }}
                onClick={() => {
                  this.vote(1);
                }}
              >
                Vote for {this.state.matchup[0].nickname}'s rap!
              </Button>
            </Col>
            <Col xs="3">
              <Button
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