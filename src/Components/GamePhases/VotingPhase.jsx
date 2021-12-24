import React from "react";
import $ from "jquery";
import anime from "animejs";
import sounds from "../../sounds.js";
import Countdown from "../Countdown.jsx";
import { Button, Card, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";
import AvatarDisplay from "../Avatar/AvatarDisplay.jsx";

export default class VotingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;
    this.restartTimer = 0;

    const fontColors = [
      "rgb(0, 119, 255)",
      "rgb(1, 158, 22)",
      "rgb(223, 15, 0)",
    ];
    // this portion generates 2 colors that are guarenteed to be different from each other
    let color1 = Math.floor(Math.random() * 3),
      color2 = Math.floor(Math.random() * 3);

    while (color1 === color2) {
      color2 = Math.floor(Math.random() * 3);
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
      selected: undefined,
      numVoted: 0,
      playerAvatar: undefined,
      opponentAvatar: undefined,
    };

    this.socket.emit("receiveMatchup", (votingInfo) => {
      this.setState({ numVoted: 0 });
      // this.setState({ matchup: votingInfo.matchup });
      this.setState({
        voted:
          this.client.name === votingInfo.matchup[0].nickname ||
          this.client.name === votingInfo.matchup[1].nickname,
      });
      this.restartTimer++;
      this.forceUpdate();
    });

    this.socket.on("numVotedSoFar", (numVoted) => {
      this.setState({ numVoted: numVoted });
    });

    this.socket.emit("getMatchupInfo", (matchup) => {
      this.setState({
        playerAvatar: matchup.avatarData,
        opponentAvatar: matchup.opponentAvatarData,
      });
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

  displayVoteConfirmation = () => {
    if (this.state.selected !== undefined) {
      $(
        `#${game.rapDisplayRow}>div:nth-child(${
          (this.state.selected + 1) ^ 3
        }), #${game.voteBtnRow}>div:nth-child(${(this.state.selected + 1) ^ 3}
        )`
      ).css("filter", "saturate(0.25)");
      return (
        <div
          id={`${game.voteConfirmation}`}
          style={{
            color:
              this.state.selected == 0 ? this.state.color1 : this.state.color2,
            display: this.state.voted ? "initial" : "none",
          }}
        >
          You voted for {this.state.matchup[this.state.selected].nickname}'s
          rap!
        </div>
      );
    }
  };

  render() {
    const { color1, color2 } = this.state;

    return (
      <div className={`${game.votePhase}`}>
        <Row>
          <div className={`${game.header}`}>Time To Vote!</div>
        </Row>
        <Row>
          <Countdown
            key={this.restartTimer}
            startDate = {this.client.startDates.votePhase}
            time={this.roomSettings.votingTime / 1000}
            before="You have"
            after="left to vote for your favorite rap!"
          />
        </Row>

        {this.state.playerAvatar !== undefined &&
          this.state.opponentAvatar !== undefined && (
            <Row id={`${game.rapDisplayRow}`}>
              <Col xs={{ offset: 2, span: 3 }} style={{ color: color1 }}>
                <Card>
                  <AvatarDisplay
                    avatar={{
                      bodyNum: this.state.playerAvatar.bodyNum,
                      eyesNum: this.state.playerAvatar.eyesNum,
                      hairNum: this.state.playerAvatar.hairNum,
                      mouthNum: this.state.playerAvatar.mouthNum,
                      shirtNum: this.state.playerAvatar.shirtNum,
                    }}
                    size={0.75}
                  />

                  <div className={`${game.rapperName}`}>
                    {this.state.matchup[0].nickname}'s bars
                  </div>
                  <div className={`${game.rap}`}>{this.renderBars(0)}</div>
                </Card>
              </Col>

              <Col xs={{ offset: 2, span: 3 }} style={{ color: color2 }}>
                <Card>
                  <AvatarDisplay
                    avatar={{
                      bodyNum: this.state.opponentAvatar.bodyNum,
                      eyesNum: this.state.opponentAvatar.eyesNum,
                      hairNum: this.state.opponentAvatar.hairNum,
                      mouthNum: this.state.opponentAvatar.mouthNum,
                      shirtNum: this.state.opponentAvatar.shirtNum,
                    }}
                    size={0.75}
                    flipped={true}
                  />
                  <div className={`${game.rapperName}`}>
                    {this.state.matchup[1].nickname}'s bars
                  </div>
                  <div className={`${game.rap}`}>{this.renderBars(1)}</div>
                </Card>
              </Col>
            </Row>
          )}

        <br />

        <Row id={`${game.voteBtnRow}`}>
          <Col
            xs={{ offset: 2, span: 3 }}
            style={{ textAlign: "center" }}
            id="rap_1"
          >
            <Button
              variant="outline-light"
              style={{
                color: color1,
                border: `1px solid ${color1}`,
              }}
              disabled={this.state.voted}
              onMouseOver={() => {
                anime({
                  targets: `#rap_1 .btn-outline-light`,
                  backgroundColor: color1,
                  color: "#fff",
                  scale: 1.1,
                  duration: 250,
                });
              }}
              onMouseOut={() => {
                anime({
                  targets: `#rap_1 .btn-outline-light`,
                  backgroundColor: "#fff",
                  color: color1,
                  scale: 1.0,
                  duration: 250,
                });
              }}
              onClick={() => {
                this.vote(1);
                this.setState({ voted: true });
                this.setState({ selected: 0 });
                sounds.play("button");
              }}
            >
              Vote for {this.state.matchup[0].nickname}'s rap!
            </Button>
          </Col>
          <Col
            xs={{ offset: 2, span: 3 }}
            style={{ textAlign: "center" }}
            id="rap_2"
          >
            <Button
              variant="outline-light"
              onMouseOver={() => {
                anime({
                  targets: `#rap_2 .btn-outline-light`,
                  backgroundColor: color2,
                  color: "#fff",
                  scale: 1.1,
                  duration: 250,
                });
              }}
              onMouseOut={() => {
                anime({
                  targets: `#rap_2 .btn-outline-light`,
                  backgroundColor: "#fff",
                  color: color2,
                  scale: 1.0,
                  duration: 250,
                });
              }}
              style={{
                color: color2,
                border: `1px solid ${color2}`,
              }}
              disabled={this.state.voted}
              onClick={() => {
                this.vote(2);
                this.setState({ voted: true });
                this.setState({ selected: 1 });
                sounds.play("button");
              }}
            >
              Vote for {this.state.matchup[1].nickname}'s rap!
            </Button>
          </Col>
        </Row>

        <Row>
          <div id={`${game.votePrompt}`}>
            {this.state.numVoted}{" "}
            {this.state.numVoted === 1 ? "person has" : "people have"} voted so
            far! Make sure you vote!
          </div>
          {this.displayVoteConfirmation()}
        </Row>
      </div>
    );
  }
}
