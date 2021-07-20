import React from "react";
import $ from "jquery";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import { Clipboard } from "react-bootstrap-icons";
import lobby from "./Lobby.module.css";

const roomId = (window.location.pathname + window.location.search).substring(1);

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.client = props.client;
    this.room = props.room;
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
              (SOCKET ID)
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
          </Col>
        </Row>

        <div id="lobbyList" />

        <Row>
          <Col xs="6">
            <Card style={{ height: "48em" }}>
              <Card.Header style={{ fontSize: "2em " }}>
                Player List
              </Card.Header>
              <Card.Body>
                <Card.Text>Player 1</Card.Text>
                <Card.Text>Player 2</Card.Text>
                <Card.Text>Player 3</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
