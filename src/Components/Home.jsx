import React from "react";
import $ from "jquery";
import cclient from "../client.js";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

import home from "./Home.module.css";

const client = new cclient();

export default class Home extends React.Component {
  render() {
    return (
      <div className={`${home.App}`}>
        <h1 id="title">ANGRY RHYME TOWN</h1>
        <Col>
          <Button
            variant="outline-dark"
            id={`${home.createLobby}`}
            onClick={client.createRoom}
          >
            Create lobby
          </Button>
          <input
            placeholder="Lobby Code"
            type="text"
            id={`${home.inputRoomID}`}
          />
          <Button
            variant="outline-dark"
            onClick={() => {
              client.redirect($(`${home.inputRoomID}`).val());
            }}
            id={`${home.joinRoom}`}
          >
            Join Room
          </Button>
        </Col>
      </div>
    );
  }
}
