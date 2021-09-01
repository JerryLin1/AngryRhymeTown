import React from "react";
import $ from "jquery";
import {
  Row,
  Col,
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import lobby from "./Lobby.module.css";
import {
  Clipboard,
  VolumeUpFill,
  VolumeMuteFill,
  Arrow90degDown,
} from "react-bootstrap-icons";
import Client from "../client.js";
import sounds from "../sounds.js";
import ConditionalWrapper from "./ConditionalWrapper";
import AvatarDisplay from "./Avatar/AvatarDisplay";

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.state = {
      numPlayers: 0,
      lobbyList: [],
      chat: [],
      muted: false,
      writingTime: 60,
      votingTime: 30,
      maxPlayers: 4,
    };
    this.client.socket.on("joinedLobby", (name) => {
      this.setState({ numPlayers: this.state.numPlayers + 1 });
    });

    if (props.match.params.roomId.length > 1) {
      this.client.joinRoom(props.match.params.roomId);
    }
    this.roomURL = `${window.location.host}/${this.props.match.params.roomId}`;
    // Update the player list in the client's room
    this.client.socket.on("updateClientList", (clients) => {
      this.name = clients[this.client.socket.id].name;

      this.room = clients;
      this.setState({
        lobbyList: Object.values(clients).map((client, key) => {
          return (
            <div
              key={key}
              className={`${lobby.playerListItem}`}
              style={{
                boxShadow:
                  client.name === this.name ? "0 0 10px #f2ff9e" : "none",
                border:
                  client.name === this.name ? "solid #e8ff52 3px" : "none",
              }}
            >
              <ConditionalWrapper
                condition={client.name === this.name}
                wrapper={(children) => <strong>{children}</strong>}
              >
                {client.name}
              </ConditionalWrapper>
              {client.isHost === true && (
                <span style={{ color: "#b59700", float: "right" }}> HOST</span>
              )}
              <div
                style={{
                  borderRadius: "0 0 10px 10px",
                  boxSizing: "border-box",
                  backgroundColor: "#52aeff",
                }}
              >
                <AvatarDisplay
                  avatar={{
                    bodyNum: client.avatar.bodyNum,
                    eyesNum: client.avatar.eyesNum,
                    hairNum: client.avatar.hairNum,
                    mouthNum: client.avatar.mouthNum,
                    shirtNum: client.avatar.shirtNum,
                  }}
                  size={0.5}
                />
              </div>
            </div>
          );
        }),
      });

      // only display "start game" button for host
      if (clients[this.client.socket.id].isHost === true) {
        $(`#${lobby.startGame}`).css("display", "initial");
        $(`#${lobby.waitingMsg}`).css("display", "none");
      } else {
        $(`#${lobby.startGame}`).css("display", "none");
        $(`#${lobby.waitingMsg}`).css("display", "initial");
      }
    });

    // Update the chat
    this.client.socket.on("receiveMessage", (chatInfo) => {
      if ($("#chat")[0] !== undefined) {
        // Autoscroll chat if scroll is already at bottom
        // Otherwise we assume they are reading chat and so do not scroll

        let autoScroll = false;
        let jsele = $("#chat")[0];
        if (jsele.scrollHeight - jsele.scrollTop === jsele.clientHeight) {
          autoScroll = true;
        }
        let chatMsg;
        let color;

        if (chatInfo.type === "SERVER") {
          chatMsg = chatInfo.msg;
          color = "blue";
        } else if (chatInfo.type === "SERVER_RED") {
          chatMsg = chatInfo.msg;
          color = "red";
        } else {
          chatMsg = (
            <span>
              <strong>{chatInfo.nickname}</strong>: {chatInfo.msg}
            </span>
          );
          color = "black";
        }
        this.setState({
          chat: this.state.chat.concat(
            <div style={{ color: color }}> {chatMsg} </div>
          ),
        });

        if (autoScroll === true) jsele.scrollTo(0, jsele.scrollHeight);
      }
    });
  }

  render() {
    return (
      <div className={`${lobby.lobby}`}>
        {/* First row that displays the room code */}
        <Form>
          <Row>
            <Col>
              <div className={lobby.ARTLogo}>ART</div>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() => {
                  // if (
                  //   this.state.numPlayers % 2 === 0 &&
                  //   this.state.numPlayers >= 4
                  // ) {
                  sounds.play("button");
                  this.client.startGame();
                  // } else {
                  //   if (this.state.numPlayers < 4) {
                  //     $(`.${lobby.ErrorMsgBg} span`).text(
                  //       "There aren't enough players to start the game! There must have at least 4 before we can start!"
                  //     );
                  //   } else {
                  //     $(`.${lobby.ErrorMsgBg} span`).text(
                  //       "There aren't an even number of players in the lobby! Try looking for 1 more or kicking someone out!"
                  //     );
                  //   }
                  //   $(`.${lobby.ErrorMsgBg}`).fadeIn();
                  // }
                }}
                id={`${lobby.startGame}`}
              >
                <strong>Start Game</strong>
              </Button>
              <div id={`${lobby.waitingMsg}`}>Waiting for host to start!</div>
            </Col>
            <Col xs="auto">
              <Form.Group id={`${lobby.copyCode}`}>
                <Form.Label column>
                  <strong>Room Link: &ensp;</strong>
                </Form.Label>
                <input id={`${lobby.roomCode}`} value={this.roomURL} readOnly />
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`${lobby.tooltip}`}>Copy Code</Tooltip>}
                >
                  <Clipboard
                    id={`${lobby.cb}`}
                    onClick={() => {
                      sounds.play("button");
                      navigator.clipboard
                        .writeText(this.roomURL)
                        .then($(".tooltip-inner").text("Copied!"));
                    }}
                  />
                </OverlayTrigger>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* ANCHOR: SECOND ROW */}
        {/* Second row that displays the players on the left and the room chat on the right */}

        <Row>
          {/* Player list */}
          <Col xs="3">
            <Card className={`${lobby.cards}`} text="white">
              <Card.Header className={`${lobby.cardHeaders}`}>
                Player List ({this.state.lobbyList.length})
              </Card.Header>
              <Card.Body id="lobbyList" style={{ overflowY: "scroll" }}>
                {this.state.lobbyList}
              </Card.Body>
            </Card>
          </Col>

          {/* Lobby Chat */}
          <Col>
            <Card
              className={`${lobby.cards}`}
              style={{ backgroundColor: "white" }}
            >
              <Card.Header className={`${lobby.cardHeaders}`}>Chat</Card.Header>
              <Card.Body id="chat" style={{ overflowY: "scroll" }}>
                {this.state.chat}
              </Card.Body>
            </Card>
            <Form
              autoComplete="off"
              style={{ marginTop: "1%" }}
              onSubmit={(event) => {
                sounds.play("button");
                event.preventDefault();
                this.client.sendMessage($(`#${lobby.chatInput}`).val());
                $(`#${lobby.chatInput}`).val("");
              }}
            >
              <div id={`${lobby.sendbar}`}>
                <input
                  placeholder="Type a message..."
                  type="text"
                  id={`${lobby.chatInput}`}
                />
                <Button
                  variant="outline-dark"
                  id={`${lobby.chatEnter}`}
                  type="submit"
                >
                  Send Message
                </Button>
              </div>
            </Form>
          </Col>

          <Col xs="4">
            <Card className={`${lobby.cards}`}>
              <Card.Header className={`${lobby.cardHeaders}`}>
                Room Settings
              </Card.Header>
              <Card.Body id={`${lobby.settings}`}>
                <Row>
                  <Col xs="3">Writing Time</Col>
                  <Col>
                    <DropdownButton
                      variant="outline-light"
                      title={`${this.state.writingTime} seconds`}
                      onSelect={(key) => {
                        this.setState({ writingTime: key });
                      }}
                    >
                      <Dropdown.Item eventKey={60}>60 seconds</Dropdown.Item>
                      <Dropdown.Item eventKey={75}>75 seconds</Dropdown.Item>
                      <Dropdown.Item eventKey={90}>90 seconds</Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>
                <Row>
                  <Col xs="3">Voting Time</Col>
                  <Col>
                    <DropdownButton
                      variant="outline-light"
                      title={`${this.state.votingTime} seconds`}
                      onSelect={(key) => {
                        this.setState({ votingTime: key });
                      }}
                    >
                      <Dropdown.Item eventKey={30}>30 seconds</Dropdown.Item>
                      <Dropdown.Item eventKey={45}>45 seconds</Dropdown.Item>
                      <Dropdown.Item eventKey={60}>60 seconds</Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>
                <Row>
                  <Col xs="3">Max players</Col>
                  <Col>
                    <DropdownButton
                      variant="outline-light"
                      title={`${this.state.maxPlayers} players`}
                      onSelect={(key) => {
                        this.setState({ maxPlayers: key });
                      }}
                    >
                      {/* Is there any better way 2 do this ._. */}
                      {[4, 5, 6, 7, 8, 9, 10].map((value) => {
                        return (
                          <Dropdown.Item eventKey={value}>
                            {value} players
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </Col>
                </Row>
                <div>
                  <Button
                    variant="light"
                    onClick={() => {
                      sounds.play("button");
                      this.setState({
                        writingTime: 60,
                        votingTime: 30,
                        maxPlayers: 4,
                      });
                    }}
                    id={`${lobby.resetBtn}`}
                  >
                    Revert to Default Settings
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Music Control button */}

        <Button
          onClick={() => {
            this.state.muted ? sounds.play("menu") : sounds.pause("menu");
            this.setState({ muted: !this.state.muted });
          }}
          variant="light"
          id={`${lobby.musicControl}`}
        >
          {this.state.muted ? <VolumeMuteFill /> : <VolumeUpFill />}
        </Button>

        {/* Error message */}
        <ErrorMsg />
      </div>
    );
  }
}

// Popup error message to notify if there are not enough players or an odd number of players in the lobby

const ErrorMsg = () => {
  return (
    <div className={`${lobby.ErrorMsgBg}`}>
      <div className={`${lobby.ErrorMsgText}`}>
        <span />
        <div
          id={`${lobby.closeErr}`}
          onClick={() => {
            sounds.play("button");
            $(`.${lobby.ErrorMsgBg}`).fadeOut();
          }}
        >
          &times;
        </div>
      </div>
    </div>
  );
};
