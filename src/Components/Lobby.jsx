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
import Client from "../client.js";

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
  }



  render() {
    return (
      <div className={`${lobby.lobby}`}>
        <Row>
          <Col>
            <h3 style={{ display: "inline-block" }}>Room Code:&ensp;</h3>
            <Form.Control
              as="textarea"
              style={{ height: "1em", width: "10em", display: "inline" }}
              id="roomCode"
            >
              {roomId}
            </Form.Control>
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
                  $("#roomCode").select();
                  document.execCommand("copy");
                  $(".tooltip-inner").text("Copied!");
                }}
              />
            </OverlayTrigger>
            <input
              placeholder="Nickname"
              type="text"
              id={`${lobby.inputNickname}`}
            />
            <Button
              variant="outline-dark"
              onClick={() => {
                this.client.setNick($(`#${lobby.inputNickname}`).val());
              }}
              id={`${lobby.setName}`}
            >
              Set Nickname
            </Button>
          </Col>
        </Row>



        <Row>
          <Col xs="6">
            <Card style={{ height: "48em" }}>
              <Card.Header style={{ fontSize: "2em " }}>
                Player List
              </Card.Header>
              <Card.Body id="lobbyList">
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ height: "24em" }}>
              <Card.Header style={{ fontSize: "2em " }}>
                Chat
              </Card.Header>
              <Card.Body id = "chat">
                
                <div id={`${lobby.sendbar}`}>
                  <input
                    placeholder="Type a message..."
                    type="text"
                    id={`${lobby.chatInput}`}
                  />
                  <Button
                    variant="outline-dark"
                    onClick = {() => {
                      this.client.sendMessage($(`#${lobby.chatInput}`).val());
                    }}
                    id={`${lobby.chatEnter}`}
                  >
                    Send Message
                  </Button>

                </div>

              </Card.Body>
            </Card>



          </Col>
        </Row>


      </div>
    );
  }
}
