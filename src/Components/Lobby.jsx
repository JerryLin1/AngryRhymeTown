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
  Overlay,
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
    this.state = { numPlayers: 0, lobbyList: [], chat: [], muted: true };

    this.client.socket.on("joinedLobby", () => {
      this.setState({ numPlayers: this.state.numPlayers + 1 });
      console.log(this.state.numPlayers);
    })

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
                backgroundColor: "#d4e5ff",
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
        console.log(chatInfo);

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
          chatMsg = chatInfo.nickname + ": " + chatInfo.msg;
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
            <Col>
              <Form.Group id={`${lobby.copyCode}`}>
                <Form.Label column>
                  <strong>Room Link: &ensp;</strong>
                </Form.Label>
                <Form.Control
                  id={`${lobby.roomCode}`}
                  value={window.location.href}
                  readOnly
                  plaintext
                />
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`${lobby.tooltip}`}>Copy Code</Tooltip>}
                >
                  <Clipboard
                    id={`${lobby.cb}`}
                    onClick={() => {
                      sounds.play("button");
                      $(`#${lobby.roomCode}`).select();
                      document.execCommand("copy");
                      $(".tooltip-inner").text("Copied!");
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
              <Card.Body></Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Music Control button */}
        <Button
          onClick={() => {
            this.state.muted ? sounds.play("menu") : sounds.pause("menu");
            this.setState({ muted: !this.state.muted });
            $(`.${lobby.musicHint}`).fadeOut();
          }}
          variant="light"
          id={`${lobby.musicControl}`}
        >
          {this.state.muted ? <VolumeMuteFill /> : <VolumeUpFill />}
        </Button>
        <MusicHint />

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

const MusicHint = () => {
  return (
    <div
      className={`${lobby.musicHint}`}
      style={{ textShadow: "0 0 2px #000" }}
    >
      Click to hear
      <br />
      some bussin beats!{" "}
      <Arrow90degDown
        id={`${lobby.hintArrow}`}
        style={{ fontSize: "0.75em" }}
      />{" "}
    </div>
  );
};
