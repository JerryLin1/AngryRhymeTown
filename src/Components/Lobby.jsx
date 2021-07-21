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
  }

  // add handler to the chat input field when the page loads
  componentDidMount() {
    $(`#${lobby.chatInput}`).on("keydown", (e) => {
      if (e.code === "Enter") {
        this.client.sendMessage($(`#${lobby.chatInput}`).val());
        $(`#${lobby.chatInput}`).val("");
      }
    });
  }

  render() {
    return (
      <div className={`${lobby.lobby}`}>
        {/* First row that displays the room code */}
        <Row>
          <Col>
            <Form.Group>
              <Form.Label column>Room Link: &ensp;</Form.Label>
              <Form.Control
                id={`${lobby.roomCode}`}
                value={window.location.href}
                readOnly
                plaintext
              />
              <OverlayTrigger
                placement="right"
                overlay={(props) => (
                  <Tooltip id={`${lobby.tooltip}`} {...props}>
                    Copy Code
                  </Tooltip>
                )}
              >
                <Clipboard
                  id={`${lobby.cb}`}
                  onMouseDown={() => {
                    $(`#${lobby.roomCode}`).select();
                    document.execCommand("copy");
                    $(".tooltip-inner").text("Copied!");
                  }}
                />
              </OverlayTrigger>
            </Form.Group>
          </Col>
        </Row>

        {/* Second row that displays the nickname changer */}
        <Row id={`${lobby.row_2}`}>
          <Col xs="auto">
            <Form.Control
              placeholder="Nickname"
              id={`${lobby.inputNickname}`}
              onChange={() => {
                let input = $(`#${lobby.inputNickname}`);
                // if statements to check if name is empty or too long
                if (
                  (input.val().length === 13 || input.val().trim() === "") &&
                  document.getElementById(`${lobby.nameWarning}`) === null
                ) {
                  if (input.val().trim().length === 0) {
                    $(`#${lobby.row_2}`).append(
                      `<div id=${lobby.nameWarning}>Nickname cannot be empty</div>`
                    );
                  } else {
                    $(`#${lobby.row_2}`).append(
                      `<div id=${lobby.nameWarning}>Nickname is too long. Must be no more than 12 characters</div>`
                    );
                  }
                } else if (
                  input.val().length > 12 ||
                  input.val().trim() === ""
                ) {
                  return;
                } else {
                  $(`#${lobby.nameWarning}`).remove();
                }
              }}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-dark"
              onClick={() => {
                const nickname = $(`#${lobby.inputNickname}`).val();
                if (document.getElementById(`${lobby.nameWarning}`) !== null) {
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
                  return;
                }
                this.client.setNick(nickname);
              }}
              id={`${lobby.setName}`}
            >
              Set Nickname
            </Button>
          </Col>
        </Row>

        {/* Third row that displays the players on the left and the room chat on the right */}
        <Row>
          {/* Player list */}
          <Col xs="6">
            <Card style={{ height: "48em" }}>
              <Card.Header style={{ fontSize: "2em " }}>
                Player List
              </Card.Header>
              <Card.Body id="lobbyList"></Card.Body>
            </Card>
          </Col>

          {/* Lobby Chat */}
          <Col>
            <Card style={{ height: "24em" }}>
              <Card.Header style={{ fontSize: "2em" }}>Chat</Card.Header>
              {/* TODO: auto scroll */}
              <Card.Body id="chat" style={{ overflowY: "scroll" }}></Card.Body>
            </Card>
            <div id={`${lobby.sendbar}`}>
              <input
                placeholder="Type a message..."
                type="text"
                id={`${lobby.chatInput}`}
              />
              <Button
                variant="outline-dark"
                onClick={() => {
                  this.client.sendMessage($(`#${lobby.chatInput}`).val());
                  $(`#${lobby.chatInput}`).val("");
                }}
                id={`${lobby.chatEnter}`}
              >
                Send Message
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
