import React from "react";
import $ from "jquery";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import lobby from "./Lobby.module.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import { Clipboard } from "react-bootstrap-icons";
import anime from "animejs";
import Client from "../client.js";
import ConditionalWrapper from "./ConditionalWrapper";

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.state = { numPlayers: 0, lobbyList: [], chat: [] };

    this.client.socket.on("joinedLobby", () => {
      this.setState({ numPlayers: this.state.numPlayers + 1 });
      console.log(this.state.numPlayers);
    });

    // Update the player list in the client's room
    this.client.socket.on("updateClientList", (clients) => {
      this.name = clients[this.client.socket.id].name;

      this.room = clients;
      this.setState({
        lobbyList: Object.values(clients).map((client, key) => {
          return (
            <div key={key}>
              <ConditionalWrapper
                condition={client.name === this.name}
                wrapper={(children) => <strong>{children}</strong>}
              >
                {client.name}
              </ConditionalWrapper>
              {client.isHost === true && (
                <span style={{ color: "#b59700" }}> HOST</span>
              )}
            </div>
          );
        }),
      });
      if (clients[this.client.socket.id].isHost === true) {
        $(`#${lobby.startGame}`).css("display", "initial");
      } else {
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
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            const nickname = $(`#${lobby.inputNickname}`).val();
            // animation that flash red and black when the player tries to submit an invalid name
            if ($(`#${lobby.nameWarning}`).css("display") !== "none") {
              anime({
                targets: `#${lobby.nameWarning}`,
                keyframes: [
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(0,0,0)" },
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(0,0,0)" },
                  { color: "rgb(255,0,0)" },
                ],
                duration: 1000,
              });
            } else if (nickname === "") {
              $(`#${lobby.nameWarning}`).text("Nickname cannot be empty");
              $(`#${lobby.nameWarning}`).show();
              anime({
                targets: `#${lobby.nameWarning}`,
                keyframes: [
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(0,0,0)" },
                  { color: "rgb(255,0,0)" },
                  { color: "rgb(0,0,0)" },
                  { color: "rgb(255,0,0)" },
                ],
                duration: 1000,
              });
            } else {
              this.client.setNick(nickname);
              $(`#${lobby.inputNickname}`).val("");
            }
          }}
        >
          <Row>
            <Col xs="auto">
              <Form.Control
                placeholder="Nickname"
                id={`${lobby.inputNickname}`}
                autoComplete="off"
                onChange={() => {
                  let input = $(`#${lobby.inputNickname}`);
                  // if statements to check if nickname is empty or too long
                  if (
                    (input.val().length === 13 || input.val().trim() === "") &&
                    $(`#${lobby.nameWarning}`).css("display") === "none"
                  ) {
                    if (input.val().trim() === "") {
                      $(`#${lobby.nameWarning}`).text(
                        "Nickname cannot be empty"
                      );
                      $(`#${lobby.nameWarning}`).show();
                    } else {
                      $(`#${lobby.nameWarning}`).text(
                        "Nickname is too long. Your nickname cannot have any more than 12 characters."
                      );
                      $(`#${lobby.nameWarning}`).show();
                    }
                  } else if (input.val().length > 12) {
                    return;
                  } else if (input.val().trim() === "") {
                    $(`#${lobby.nameWarning}`).text("Nickname cannot be empty");
                    return;
                  } else {
                    $(`#${lobby.nameWarning}`).hide();
                  }
                }}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-dark"
                type="submit"
                id={`${lobby.setName}`}
              >
                Set Nickname
              </Button>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() => {
                  // if (
                  //   this.state.numPlayers % 2 === 0 &&
                  //   this.state.numPlayers >= 4
                  // ) {
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
                size="lg"
              >
                Start Game
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
        <div id={`${lobby.nameWarning}`} style={{ display: "none" }}></div>

        {/* Second row that displays the players on the left and the room chat on the right */}
        <Row>
          {/* Player list */}
          <Col xs="6">
            <Card style={{ height: "28em" }}>
              <Card.Header style={{ fontSize: "2em " }}>
                Player List
              </Card.Header>
              <Card.Body id="lobbyList">{this.state.lobbyList}</Card.Body>
            </Card>
          </Col>

          {/* Lobby Chat */}
          <Col>
            <Card style={{ height: "28em", marginBottom: "0.25em" }}>
              <Card.Header style={{ fontSize: "2em" }}>Chat</Card.Header>
              <Card.Body id="chat" style={{ overflowY: "scroll" }}>
                {this.state.chat}
              </Card.Body>
            </Card>
            <Form
              autoComplete="off"
              onSubmit={(event) => {
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
        </Row>
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
            $(`.${lobby.ErrorMsgBg}`).fadeOut();
          }}
        >
          &times;
        </div>
      </div>
    </div>
  );
};
