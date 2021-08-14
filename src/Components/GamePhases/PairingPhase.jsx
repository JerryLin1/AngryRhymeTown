import React from "react";
import Countdown from "../Countdown.jsx";
import { Card, Col, Row } from "react-bootstrap";
import game from "../Game.module.css";
import AvatarDisplay from "../Avatar/AvatarDisplay.jsx";

export default class PairingPhase extends React.Component {
  constructor(props) {
    super(props);
    this.client = this.props.client;
    this.socket = this.props.client.socket;
    this.roomSettings = this.props.client.roomSettings;

    this.state = {
      opponent: "",
      avatarData: undefined,
      opponentAvatarData: undefined,
      currentMatchup: [],
      matchups: []
    };

    this.socket.on("sendPairings", (pairDisplay) => {
      console.log(this.client.nickname);
      let matchups = [];
      for (let pair of pairDisplay) {
        // TODO: fix highlight of opponent, if no fix possible, revert to old version
        matchups.push(
          <div className={`${game.pairWrapper}`}>
            <div
              className={`${game.pairName}`}
              style={{
                boxShadow:
                  this.client.nickname === pair[0]
                    ? "0 0 10px #f2ff9e"
                    : "0 0 10px #fff",
                border:
                  this.client.nickname === pair[0]
                    ? "solid #e8ff52 3px"
                    : "solid #fff 3px",
              }}
            >
              {pair[0]}
            </div>
            <strong>V. S.</strong>
            <div
              className={`${game.pairName}`}
              style={{
                boxShadow:
                  this.client.nickname === pair[1]
                    ? "0 0 10px #f2ff9e"
                    : "0 0 10px #fff",
                border:
                  this.client.nickname === pair[1]
                    ? "solid #e8ff52 3px"
                    : "solid #fff 3px",
              }}
            >
              {pair[1]}
            </div>
          </div>
        );
      }
      this.setState({ matchups: matchups });

      this.socket.emit("getMatchupInfo", (matchup) => {
        this.setState({
          currentMatchup: [
            <div className={`${game.pairName} ${game.currentPairName}`}>
              {matchup.name}
            </div>,
            <div className={`${game.pairName} ${game.currentPairName}`}>
              {matchup.opponent}
            </div>,
          ],
        });
        this.setState({ opponent: matchup.opponent });
        this.setState({ avatarData: matchup.avatarData });
        this.setState({ opponentAvatarData: matchup.opponentAvatarData });
      });
    });
  }

  render() {
    return (
      <div>
        <div className={`${game.header}`}>
          <Countdown
            time={this.roomSettings.pairingTime / 1000}
            before="The game starts in"
          />
        </div>

        <Card id={`${game.opponentCard}`}>
          <Card.Header id={`${game.opponentCardHeader}`}>
            Your opponent is: <strong>{this.state.opponent}</strong>
          </Card.Header>
          <Card.Body>
            {this.state.avatarData !== undefined &&
              this.state.opponentAvatarData !== undefined && (
                <Row className={`${game.avatarMatchupWrapper}`}>
                  <Col className={`${game.matchupAvatar}`}>
                    <AvatarDisplay
                      avatar={{
                        bodyNum: this.state.avatarData.bodyNum,
                        eyesNum: this.state.avatarData.eyesNum,
                        hairNum: this.state.avatarData.hairNum,
                        mouthNum: this.state.avatarData.mouthNum,
                        shirtNum: this.state.avatarData.shirtNum,
                      }}
                      size={2}
                    />
                    {this.state.currentMatchup[0]}
                  </Col>
                  <Col
                    className={`${game.matchupVersus}`}
                    style={{ fontSize: "4em", alignSelf: "center" }}
                  >
                    V. S.
                  </Col>
                  <Col className={`${game.matchupAvatar}`}>
                    <AvatarDisplay
                      avatar={{
                        bodyNum: this.state.opponentAvatarData.bodyNum,
                        eyesNum: this.state.opponentAvatarData.eyesNum,
                        hairNum: this.state.opponentAvatarData.hairNum,
                        mouthNum: this.state.opponentAvatarData.mouthNum,
                        shirtNum: this.state.opponentAvatarData.shirtNum,
                      }}
                      flipped={true}
                      size={2}
                    />
                    {this.state.currentMatchup[1]}
                  </Col>
                </Row>
              )}
            {this.state.matchups}
            {/* <div style={{ fontSize: "1.25em" }}><div className={`${game.pairName}`}>WWWWWWWWWWWW</div><strong>V. S.</strong><div className={`${game.pairName}`}>test</div></div> */}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
