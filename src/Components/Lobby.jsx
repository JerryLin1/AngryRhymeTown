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

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.state = { numPlayers: 0 };

    this.client.socket.on("joinedLobby", () => {
      this.setState({ numPlayers: this.state.numPlayers + 1 });
      console.log(this.state.numPlayers);
    });

    // Update the player list in the client's room
    this.client.socket.on("updateClientList", (clients) => {
      $("#lobbyList").html("");
      this.name = clients[this.client.socket.id].name;

      this.room = clients;

      for (let client of Object.values(clients)) {
        if (client.isHost === true) {
          $("#lobbyList").append(
            `<div> ${client.name} <span style="color: #fab234"> - HOST</span></div>`
          );
        } else {
          $("#lobbyList").append(`<div> ${client.name}</div>`);
        }
      }
      if (clients[this.client.socket.id].isHost === true) {
        $(`#${lobby.startGame}`).css("display", "initial");
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
                onChange={() => {
                  let input = $(`#${lobby.inputNickname}`);
                  // if statements to check if name is empty or too long
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
                        "Nickname is too long. It must be no more than 12 characters"
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
            </Col>
            <Col>
              <Form.Group id={`${lobby.copyCode}`}>
                <Form.Label column>Room Link: &ensp;</Form.Label>
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
        <div id={`${lobby.nameWarning}`} style={{ display: "none" }}>
          Nickname is too long. It must be no more than 12 characters
        </div>

        {/* Second row that displays the players on the left and the room chat on the right */}
        <Row>
          {/* Player list */}
          <Col xs="6">
            <Card style={{ height: "28em" }}>
              <Card.Header style={{ fontSize: "2em " }}>
                Player List
              </Card.Header>
              <Card.Body id="lobbyList"></Card.Body>
            </Card>
          </Col>

          {/* Lobby Chat */}
          <Col>
            <Card style={{ height: "28em", marginBottom: "0.25em" }}>
              <Card.Header style={{ fontSize: "2em" }}>Chat</Card.Header>
              <Card.Body id="chat" style={{ overflowY: "scroll" }}></Card.Body>
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
